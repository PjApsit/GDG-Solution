import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kfdraueleiklifyawnvi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmZHJhdWVsZWlrbGlmeWF3bnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNzQ1NTQsImV4cCI6MjA5Mjk1MDU1NH0.JowMrrwbEc-ONHEB1fHamvq2VqawUk1IJHhqcHrZumU';
const supabase = createClient(supabaseUrl, supabaseKey);

const ngos = [
  { email: 'ngo1@test.com', name: 'Global Care NGO' },
  { email: 'ngo2@test.com', name: 'Hope Relief' },
  { email: 'ngo3@test.com', name: 'Earth Protectors' },
  { email: 'ngo4@test.com', name: 'Water For All' },
  { email: 'ngo5@test.com', name: 'Crisis Response Team' },
];

const vols = [
  { email: 'vol1@test.com', name: 'Alice Smith', skills: ['Medical', 'First Aid'] },
  { email: 'vol2@test.com', name: 'Bob Johnson', skills: ['Logistics', 'Transportation'] },
  { email: 'vol3@test.com', name: 'Charlie Davis', skills: ['Teaching', 'Counseling'] },
  { email: 'vol4@test.com', name: 'Diana Prince', skills: ['Disaster Relief', 'First Aid'] },
  { email: 'vol5@test.com', name: 'Evan Wright', skills: ['Data Entry', 'Community Outreach'] },
];

async function run() {
  console.log("Populating 5 NGOs...");
  for (const ngo of ngos) {
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: ngo.email,
      password: 'password123',
      options: {
        data: { full_name: ngo.name }
      }
    });
    
    if (authErr) {
      console.log(`Failed to create ${ngo.email}:`, authErr.message);
      continue;
    }
    
    const user = authData.user;
    console.log(`Created Auth User: ${ngo.email}`);

    // Create profile
    await supabase.from('profiles').upsert({
      id: user.id,
      email: ngo.email,
      full_name: ngo.name,
      role: 'ngo',
      organization: ngo.name,
      skills: [],
      location: 'Global',
      impact_points: 0,
      tasks_completed: 0,
      contact_status: 'Online'
    });
    console.log(`Created Profile: ${ngo.email}`);
  }

  console.log("\nPopulating 5 Volunteers...");
  for (const vol of vols) {
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: vol.email,
      password: 'password123',
      options: {
        data: { full_name: vol.name }
      }
    });
    
    if (authErr) {
      console.log(`Failed to create ${vol.email}:`, authErr.message);
      continue;
    }
    
    const user = authData.user;
    console.log(`Created Auth User: ${vol.email}`);

    // Create profile
    await supabase.from('profiles').upsert({
      id: user.id,
      email: vol.email,
      full_name: vol.name,
      role: 'volunteer',
      organization: '',
      skills: vol.skills,
      location: 'Local',
      impact_points: Math.floor(Math.random() * 500),
      tasks_completed: Math.floor(Math.random() * 20),
      contact_status: 'Online'
    });

    // Create public.volunteers
    await supabase.from('volunteers').upsert({
      id: user.id,
      email: vol.email,
      full_name: vol.name,
      availability_status: 'Available',
      skills: vol.skills,
      location: 'Local'
    });
    console.log(`Created Profile & Volunteer entry: ${vol.email}`);
  }
  
  console.log("\nDone!");
}

run();
