/**
 * projectService.js
 * All Supabase operations for Projects, Assets, Volunteers, and Tasks.
 * UI components should import from here, never call supabase directly.
 */

import { supabase } from './supabaseClient';

// ─────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────

/** Create a new project and upload any attached intel files. */
export const createProject = async (formData, userId) => {
  const { projectName, missionDescription, geospatialAnchor, operativeCapacity, intelFiles } = formData;

  // 1. Insert the project record
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert([
      {
        owner_id: userId,
        title: projectName,
        description: missionDescription,
        location: geospatialAnchor,
        operative_capacity: parseInt(operativeCapacity) || 0,
        status: 'active',
      },
    ])
    .select()
    .single();

  if (projectError) throw projectError;

  // 2. Upload each intel file to Storage and record metadata
  if (intelFiles && intelFiles.length > 0) {
    for (const file of intelFiles) {
      await uploadProjectAsset(project.id, file, userId);
    }
  }

  return project;
};

/** Fetch all projects owned by a specific user. */
export const getUserProjects = async (userId) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

/** Fetch a single project with its assets, volunteers, and tasks. */
export const getProjectById = async (projectId) => {
  // Fetch the core project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (projectError) throw projectError;

  // Fetch assets
  const { data: assets } = await supabase
    .from('project_assets')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  // Fetch volunteers with their profile details joined
  const { data: volunteers } = await supabase
    .from('project_volunteers')
    .select(`
      *,
      volunteer:volunteers(full_name, email, location, skills, availability_status)
    `)
    .eq('project_id', projectId);

  // Fetch tasks
  const { data: tasks } = await supabase
    .from('project_tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  return {
    ...project,
    assets: assets || [],
    volunteers: volunteers || [],
    tasks: tasks || [],
  };
};

// ─────────────────────────────────────────────
// ASSETS (FILE UPLOADS)
// ─────────────────────────────────────────────

/** Upload a file to Supabase Storage and insert metadata into project_assets. */
export const uploadProjectAsset = async (projectId, file, userId) => {
  const timestamp = Date.now();
  // Store under the user's ID folder so storage RLS policies match
  const filePath = `${userId}/${projectId}/${timestamp}_${file.name}`;

  // 1. Upload to Storage
  const { error: storageError } = await supabase.storage
    .from('mission-intel')
    .upload(filePath, file);

  if (storageError) {
    console.error('Storage upload failed:', storageError);
    throw storageError;
  }

  // 2. Insert metadata into DB
  const fileType = file.name.split('.').pop().toLowerCase(); // 'pdf', 'csv', etc.

  const { data, error: dbError } = await supabase
    .from('project_assets')
    .insert([
      {
        project_id: projectId,
        uploaded_by: userId,
        file_name: file.name,
        file_path: filePath,
        file_size_bytes: file.size,
        file_type: fileType,
      },
    ])
    .select()
    .single();

  if (dbError) throw dbError;
  return data;
};

/** Generate a short-lived (60 min) signed URL for a private file asset. */
export const getAssetSignedUrl = async (filePath) => {
  const { data, error } = await supabase.storage
    .from('mission-intel')
    .createSignedUrl(filePath, 3600); // 1 hour

  if (error) throw error;
  return data.signedUrl;
};

// ─────────────────────────────────────────────
// VOLUNTEERS
// ─────────────────────────────────────────────

/** Add a volunteer assignment to a project. */
export const addVolunteerToProject = async (projectId, volunteerId, details) => {
  const { data, error } = await supabase
    .from('project_volunteers')
    .insert([
      {
        project_id: projectId,
        volunteer_id: volunteerId,
        role_in_project: details.role,
        deployment_area: details.area,
        contact_status: details.contactStatus || 'Offline',
        task_status: details.taskStatus || 'STANDBY',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/** Update a volunteer's task/contact status for a project. */
export const updateVolunteerStatus = async (assignmentId, updates) => {
  const { data, error } = await supabase
    .from('project_volunteers')
    .update(updates)
    .eq('id', assignmentId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ─────────────────────────────────────────────
// TASKS
// ─────────────────────────────────────────────

/** Create a task for a project. */
export const createTask = async (projectId, taskData) => {
  const { data, error } = await supabase
    .from('project_tasks')
    .insert([
      {
        project_id: projectId,
        title: taskData.title,
        assigned_to: taskData.assignedTo || null,
        status: taskData.status || 'pending',
        due_date: taskData.dueDate || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/** Update a task's status. */
export const updateTaskStatus = async (taskId, status) => {
  const { data, error } = await supabase
    .from('project_tasks')
    .update({ status })
    .eq('id', taskId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ─────────────────────────────────────────────
// VOLUNTEER PROFILES
// ─────────────────────────────────────────────

/** Create or update the volunteer's personal profile (called during onboarding). */
export const saveVolunteerProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('volunteers')
    .upsert(
      {
        id: userId,
        full_name: profileData.full_name,
        email: profileData.email,
        gender: profileData.gender,
        age: profileData.age,
        location: profileData.location,
        education: profileData.education,
        skills: profileData.skills || [],
        availability_status: profileData.availability_status || 'Available',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};

/** Get all volunteers available for assignment. */
export const getAllVolunteers = async () => {
  const { data, error } = await supabase
    .from('volunteers')
    .select('*')
    .order('full_name');

  if (error) throw error;
  return data || [];
};

// ─────────────────────────────────────────────
// TASK ASSIGNMENTS (Volunteer Accept/Decline)
// ─────────────────────────────────────────────

/**
 * Get all tasks assigned to a volunteer, with full task + project details.
 * Used on volunteer Dashboard and My Work pages.
 */
export const getVolunteerAssignments = async (volunteerId) => {
  const { data, error } = await supabase
    .from('task_assignments')
    .select(`
      *,
      task:project_tasks(
        id, title, description, ngo_name, location, urgency, deadline, why, status,
        project:projects(id, title, owner_id)
      )
    `)
    .eq('volunteer_id', volunteerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Volunteer responds to an assignment: 'accepted' or 'declined'.
 * Once set, the status is locked in the UI.
 */
export const respondToAssignment = async (assignmentId, response) => {
  const { data, error } = await supabase
    .from('task_assignments')
    .update({
      status: response, // 'accepted' or 'declined'
      responded_at: new Date().toISOString(),
    })
    .eq('id', assignmentId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * NGO assigns a task to a specific volunteer.
 * Creates an entry in task_assignments with status 'pending'.
 */
export const assignTaskToVolunteer = async (taskId, volunteerId) => {
  const { data, error } = await supabase
    .from('task_assignments')
    .insert([{ task_id: taskId, volunteer_id: volunteerId, status: 'pending' }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Get all task assignments for an NGO's project tasks.
 * NGO uses this to see volunteer responses on Mission Control.
 */
export const getProjectTaskAssignments = async (projectId) => {
  const { data, error } = await supabase
    .from('task_assignments')
    .select(`
      *,
      task:project_tasks!inner(id, title, project_id),
      volunteer:volunteers(full_name, email, availability_status)
    `)
    .eq('task.project_id', projectId);

  if (error) throw error;
  return data || [];
};

// ─────────────────────────────────────────────
// WORK PROOFS (Photo Completion)
// ─────────────────────────────────────────────

/**
 * Volunteer uploads a photo proof to mark a task complete.
 * Uploads to 'work-proofs' bucket, then records metadata in DB.
 */
export const submitWorkProof = async (assignmentId, volunteerId, photoFile, note = '') => {
  const timestamp = Date.now();
  const filePath = `${volunteerId}/${assignmentId}/${timestamp}_${photoFile.name}`;

  // 1. Upload image to storage
  const { error: storageError } = await supabase.storage
    .from('work-proofs')
    .upload(filePath, photoFile);

  if (storageError) throw storageError;

  // 2. Save metadata to DB
  const { data, error: dbError } = await supabase
    .from('work_proofs')
    .insert([{
      assignment_id: assignmentId,
      volunteer_id: volunteerId,
      file_path: filePath,
      file_name: photoFile.name,
      note,
    }])
    .select()
    .single();

  if (dbError) throw dbError;

  // 3. Mark assignment as completed
  await supabase
    .from('task_assignments')
    .update({ status: 'completed' })
    .eq('id', assignmentId);

  return data;
};

/** Get a signed URL for a work proof photo. */
export const getWorkProofUrl = async (filePath) => {
  const { data, error } = await supabase.storage
    .from('work-proofs')
    .createSignedUrl(filePath, 3600);

  if (error) throw error;
  return data.signedUrl;
};

/** Get all work proofs for a specific assignment. NGO uses this to verify completion. */
export const getWorkProofsForAssignment = async (assignmentId) => {
  const { data, error } = await supabase
    .from('work_proofs')
    .select('*')
    .eq('assignment_id', assignmentId)
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// ─────────────────────────────────────────────
// NGO FOLLOWS (Volunteer ↔ NGO relationship)
// ─────────────────────────────────────────────

/** Get all NGOs (users with role='ngo') for the directory. */
export const getAllNGOs = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, organization, location, email')
    .eq('role', 'ngo')
    .order('full_name');
  if (error) throw error;
  return data || [];
};

/** Get all NGO IDs that a volunteer is currently following. */
export const getFollowedNGOs = async (volunteerId) => {
  const { data, error } = await supabase
    .from('ngo_follows')
    .select('ngo_id')
    .eq('volunteer_id', volunteerId);
  if (error) throw error;
  return (data || []).map((r) => r.ngo_id);
};

/** Follow an NGO. */
export const followNGO = async (volunteerId, ngoId) => {
  const { error } = await supabase
    .from('ngo_follows')
    .insert([{ volunteer_id: volunteerId, ngo_id: ngoId }]);
  if (error) throw error;
};

/** Unfollow an NGO. */
export const unfollowNGO = async (volunteerId, ngoId) => {
  const { error } = await supabase
    .from('ngo_follows')
    .delete()
    .eq('volunteer_id', volunteerId)
    .eq('ngo_id', ngoId);
  if (error) throw error;
};

/** Get all volunteers that follow a given NGO (used by NGO to pick volunteers). */
export const getNGOFollowers = async (ngoId) => {
  const { data, error } = await supabase
    .from('ngo_follows')
    .select(`
      volunteer_id,
      volunteer:volunteers(id, full_name, email, location, skills, availability_status, age, gender, education)
    `)
    .eq('ngo_id', ngoId);
  if (error) throw error;
  return (data || []).map((r) => r.volunteer).filter(Boolean);
};

// ─────────────────────────────────────────────
// TASK CREATION (full — with optional assignment)
// ─────────────────────────────────────────────

/**
 * NGO creates a new task for a project, with optional volunteer assignment.
 * If volunteerId is provided, a task_assignment record is created immediately.
 */
export const createFullTask = async (projectId, taskData, volunteerId = null) => {
  // 1. Create the task
  const { data: task, error: taskError } = await supabase
    .from('project_tasks')
    .insert([{
      project_id: projectId,
      title: taskData.title,
      description: taskData.description,
      ngo_name: taskData.ngo_name,
      location: taskData.location,
      urgency: taskData.urgency || 'medium',
      deadline: taskData.deadline || null,
      why: taskData.why,
      status: 'pending',
    }])
    .select()
    .single();

  if (taskError) throw taskError;

  // 2. Assign to volunteer if one was selected
  if (volunteerId) {
    await assignTaskToVolunteer(task.id, volunteerId);
  }

  return task;
};

/** Get all tasks for a project WITH their assignment statuses. */
export const getProjectTasksWithAssignments = async (projectId) => {
  const { data, error } = await supabase
    .from('project_tasks')
    .select(`
      *,
      assignments:task_assignments(
        id, status, responded_at, volunteer_id,
        volunteer:volunteers(full_name, email, availability_status)
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};
