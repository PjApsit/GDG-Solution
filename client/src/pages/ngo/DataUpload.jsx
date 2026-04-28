import React, { useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  FileText,
  Image,
  Loader2,
  MapPin,
  Sparkles,
  Table2,
  Upload,
  X,
} from 'lucide-react';
import { ingestionApi } from '../../services/api';

const ACCEPTED_FILES = '.csv,.xlsx,.xls,.pdf,.txt,.png,.jpg,.jpeg,.webp';
const MAX_FILES = 25;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const fileKey = (file) => `${file.name}-${file.size}-${file.lastModified}`;

const getFileIcon = (name) => {
  const ext = name.split('.').pop()?.toLowerCase();
  if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return Image;
  if (['csv', 'xlsx', 'xls'].includes(ext)) return Table2;
  return FileText;
};

const statusBadge = (status) => {
  if (status === 'success') return 'badge-success';
  if (status === 'failed') return 'badge-critical';
  return 'badge-neutral';
};

const ResultTable = ({ table }) => {
  if (!table?.columns?.length) return null;

  return (
    <div className="border border-outline-variant rounded overflow-hidden">
      <div className="px-4 py-2 bg-surface-container-high border-b border-outline-variant flex items-center justify-between gap-3">
        <h4 className="text-h3 text-on-surface">{table.title}</h4>
        <span className="text-body-sm text-on-surface-variant">{table.rowCount} rows</span>
      </div>
      <div className="overflow-x-auto max-h-80">
        <table className="min-w-full text-left">
          <thead className="sticky top-0">
            <tr>
              {table.columns.map((column) => (
                <th key={column} className="table-header whitespace-nowrap">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={`${table.title}-${rowIndex}`}>
                {table.columns.map((column) => (
                  <td key={column} className="table-cell max-w-xs truncate">
                    {row[column] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DataUpload = () => {
  const inputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const totalSize = useMemo(
    () => selectedFiles.reduce((sum, file) => sum + file.size, 0),
    [selectedFiles]
  );

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    const existing = new Set(selectedFiles.map(fileKey));
    const accepted = [];
    const rejected = [];

    for (const file of incoming) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        rejected.push(`${file.name} is larger than 10 MB`);
        continue;
      }
      if (existing.has(fileKey(file))) continue;
      accepted.push(file);
      existing.add(fileKey(file));
    }

    const nextFiles = [...selectedFiles, ...accepted].slice(0, MAX_FILES);
    setSelectedFiles(nextFiles);
    setError(rejected[0] || (selectedFiles.length + accepted.length > MAX_FILES ? `Upload up to ${MAX_FILES} files at a time.` : ''));
  };

  const removeFile = (target) => {
    setSelectedFiles((files) => files.filter((file) => fileKey(file) !== fileKey(target)));
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;

    setIsUploading(true);
    setError('');
    setResult(null);

    try {
      const response = await ingestionApi.upload(selectedFiles);
      setResult(response);
    } catch (uploadError) {
      setError(uploadError.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-h1 text-on-surface mb-2">Data Upload</h1>
        <p className="text-body-base text-on-surface-variant">
          Ingest field files and convert them into reviewable NGO intelligence.
        </p>
      </header>

      <section className="card space-y-4">
        <div
          className={`border-2 border-dashed rounded p-6 bg-surface-container-low transition-colors ${
            isDragging ? 'border-primary-container bg-primary/5' : 'border-outline-variant'
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            addFiles(event.dataTransfer.files);
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded bg-primary-container flex items-center justify-center shrink-0">
                <Upload className="w-5 h-5 text-on-primary" />
              </div>
              <div>
                <h2 className="text-h2 text-on-surface">Upload source files</h2>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  WhatsApp text exports, PDFs, images, CSV, and Excel files.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_FILES}
                multiple
                className="hidden"
                onChange={(event) => addFiles(event.target.files)}
              />
              <button type="button" className="btn-secondary" onClick={() => inputRef.current?.click()}>
                <Upload className="w-4 h-4" />
                Browse
              </button>
              <button
                type="button"
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedFiles.length || isUploading}
                onClick={handleUpload}
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                Process
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 text-error bg-error/10 border border-error/20 rounded px-3 py-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="text-body-sm">{error}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-body-sm text-on-surface-variant">
          <span>{selectedFiles.length} selected files</span>
          <span>{formatBytes(totalSize)} total</span>
        </div>

        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {selectedFiles.map((file) => {
              const Icon = getFileIcon(file.name);
              return (
                <div key={fileKey(file)} className="border border-outline-variant rounded p-3 bg-surface-container-lowest flex items-center gap-3">
                  <Icon className="w-5 h-5 text-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-body-base text-on-surface truncate">{file.name}</p>
                    <p className="text-body-sm text-on-surface-variant">{formatBytes(file.size)}</p>
                  </div>
                  <button type="button" className="btn-ghost px-2" onClick={() => removeFile(file)} aria-label={`Remove ${file.name}`}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {result && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="stat-card">
              <span className="text-body-sm text-on-surface-variant">Files</span>
              <span className="text-h2 text-on-surface">{result.totalFiles}</span>
            </div>
            <div className="stat-card">
              <span className="text-body-sm text-on-surface-variant">Processed</span>
              <span className="text-h2 text-primary">{result.successfulFiles}</span>
            </div>
            <div className="stat-card">
              <span className="text-body-sm text-on-surface-variant">Insights</span>
              <span className="text-h2 text-on-surface">{result.insightCount}</span>
            </div>
            <div className="stat-card">
              <span className="text-body-sm text-on-surface-variant">Suggested Events</span>
              <span className="text-h2 text-on-surface">{result.suggestedEventCount}</span>
            </div>
          </div>

          {result.insights?.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-h2 text-on-surface">Batch Insights</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.insights.map((insight) => (
                  <div key={insight} className="flex items-start gap-2 text-body-base text-on-surface">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.suggestedEvents?.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-h2 text-on-surface">Suggested Events</h2>
              </div>
              <div className="overflow-x-auto border border-outline-variant rounded">
                <table className="min-w-full text-left">
                  <thead>
                    <tr>
                      <th className="table-header">Problem</th>
                      <th className="table-header">Location</th>
                      <th className="table-header">Priority</th>
                      <th className="table-header">Affected</th>
                      <th className="table-header">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.suggestedEvents.map((event, index) => (
                      <tr key={`${event.problem_type}-${index}`}>
                        <td className="table-cell whitespace-nowrap">{event.problem_type}</td>
                        <td className="table-cell whitespace-nowrap">{event.location}</td>
                        <td className="table-cell font-semibold text-primary">{event.priority_score}</td>
                        <td className="table-cell">{event.affected_count?.toLocaleString?.() || 0}</td>
                        <td className="table-cell min-w-[20rem]">{event.why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {result.files.map((file) => (
              <article key={file.fileName} className="card space-y-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-h2 text-on-surface">{file.fileName}</h3>
                      <span className={statusBadge(file.status)}>{file.status}</span>
                    </div>
                    <p className="text-body-base text-on-surface-variant">{file.summary}</p>
                  </div>
                  <span className="text-body-sm text-on-surface-variant whitespace-nowrap">{formatBytes(file.sizeBytes)}</span>
                </div>

                {file.warnings?.length > 0 && (
                  <div className="border border-tertiary/20 bg-tertiary/10 rounded px-3 py-2 space-y-1">
                    {file.warnings.map((warning) => (
                      <div key={warning} className="flex items-start gap-2 text-body-sm text-tertiary">
                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{warning}</span>
                      </div>
                    ))}
                  </div>
                )}

                {file.insights?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {file.insights.map((insight) => (
                      <span key={insight} className="badge-neutral normal-case uppercase">
                        {insight}
                      </span>
                    ))}
                  </div>
                )}

                {file.keywords?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {file.keywords.map((keyword) => (
                      <span key={keyword} className="badge-success normal-case uppercase">
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}

                {file.extractedTextPreview && (
                  <div>
                    <h4 className="text-h3 text-on-surface mb-2">Extracted Text</h4>
                    <p className="text-body-sm text-on-surface-variant bg-surface-container-low rounded p-3 max-h-40 overflow-y-auto">
                      {file.extractedTextPreview}
                    </p>
                  </div>
                )}

                {file.tables?.length > 0 && (
                  <div className="space-y-3">
                    {file.tables.map((table, index) => (
                      <ResultTable key={`${file.fileName}-${table.title}-${index}`} table={table} />
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DataUpload;
