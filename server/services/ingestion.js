import { spawn } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { calculatePriority } from './priority.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROCESSOR_PATH = path.join(__dirname, 'ingestion_processor.py');
const LOCAL_VENV_PYTHON = process.platform === 'win32'
  ? path.join(__dirname, '..', '.venv', 'Scripts', 'python.exe')
  : path.join(__dirname, '..', '.venv', 'bin', 'python');
const PYTHON_COMMAND = process.env.PYTHON_COMMAND
  || process.env.PYTHON
  || (existsSync(LOCAL_VENV_PYTHON) ? LOCAL_VENV_PYTHON : 'python');
const PROCESS_TIMEOUT_MS = 60_000;

const unique = (items) => [...new Set(items.filter(Boolean))];

function runPythonProcessor(files) {
  const payload = {
    generatedAt: new Date().toISOString(),
    files: files.map((file) => ({
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      contentBase64: file.buffer.toString('base64'),
    })),
  };

  return new Promise((resolve, reject) => {
    const child = spawn(PYTHON_COMMAND, [PROCESSOR_PATH], {
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';
    let settled = false;

    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill();
      const error = new Error('Data processing timed out. Try fewer or smaller files.');
      error.statusCode = 504;
      reject(error);
    }, PROCESS_TIMEOUT_MS);

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      error.message = `Could not start Python processor: ${error.message}`;
      error.statusCode = 500;
      reject(error);
    });

    child.on('close', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);

      if (code !== 0) {
        const error = new Error(stderr.trim() || 'Python processor failed.');
        error.statusCode = 500;
        reject(error);
        return;
      }

      try {
        resolve(JSON.parse(stdout));
      } catch (_error) {
        const error = new Error('Python processor returned invalid JSON.');
        error.statusCode = 500;
        reject(error);
      }
    });

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });
}

function addPriorityToSuggestion(suggestedEvent) {
  if (!suggestedEvent) return null;

  const eventData = {
    severity: suggestedEvent.severity || 0,
    urgency: suggestedEvent.urgency || 0,
    data_age_days: suggestedEvent.data_age_days || 0,
    affected_count: suggestedEvent.affected_count || 0,
    accessibility: suggestedEvent.accessibility || 5,
  };

  const { priority_score, why } = calculatePriority(eventData);
  return {
    ...suggestedEvent,
    priority_score,
    why,
  };
}

function buildBatchSummary(files) {
  const successfulFiles = files.filter((file) => file.status === 'success').length;
  const failedFiles = files.length - successfulFiles;
  const insights = unique(files.flatMap((file) => file.insights || [])).slice(0, 10);
  const suggestedEvents = files
    .map((file) => file.suggestedEvent)
    .filter(Boolean)
    .sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0));

  return {
    totalFiles: files.length,
    successfulFiles,
    failedFiles,
    insightCount: insights.length,
    suggestedEventCount: suggestedEvents.length,
    insights,
    suggestedEvents,
  };
}

export async function processIngestionBatch(files) {
  const processed = await runPythonProcessor(files);
  const processedFiles = (processed.files || []).map((file) => ({
    ...file,
    suggestedEvent: addPriorityToSuggestion(file.suggestedEvent),
  }));

  const batch = buildBatchSummary(processedFiles);

  return {
    batchId: `ing-${Date.now()}`,
    processedAt: new Date().toISOString(),
    ...batch,
    files: processedFiles,
  };
}
