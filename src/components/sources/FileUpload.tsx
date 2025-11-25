'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Source } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface FileUploadProps {
  onSourcesAdd: (sources: Source[]) => void;
  existingSources: Source[];
}

interface UploadedFile {
  id: string;
  file: File;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  content?: string;
  error?: string;
}

export default function FileUpload({ onSourcesAdd, existingSources }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Process file via server-side API for .docx and other complex formats
  const processFileViaAPI = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/process-file', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to process file');
    }

    return data.content;
  };

  // Process file - use API for .docx, client-side for text files
  const processFile = async (file: File): Promise<string> => {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    // Handle .docx files via server-side API (mammoth requires Node.js)
    if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      return await processFileViaAPI(file);
    }

    // Handle .doc files via server-side API
    if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
      return await processFileViaAPI(file);
    }

    // Handle PDF files via server-side API
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await processFileViaAPI(file);
    }

    // Handle text-based files (txt, md, csv) - can be done client-side
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setIsProcessing(true);

      // Create file entries - each file gets its own unique ID
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: uuidv4(),
        file,
        status: 'uploading' as const,
        progress: 0,
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Collect all successfully processed sources - EACH FILE IS A SEPARATE SOURCE
      const processedSources: Source[] = [];

      // Process each file individually
      for (let i = 0; i < newFiles.length; i++) {
        const uploadedFile = newFiles[i];

        try {
          // Update progress animation
          for (let p = 0; p <= 60; p += 20) {
            await new Promise((resolve) => setTimeout(resolve, 50));
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.id === uploadedFile.id ? { ...f, progress: p, status: 'uploading' } : f
              )
            );
          }

          // Set to processing
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === uploadedFile.id ? { ...f, status: 'processing', progress: 70 } : f))
          );

          // Process the file (via API or client-side)
          const content = await processFile(uploadedFile.file);

          // Update to complete
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id
                ? { ...f, status: 'completed', content, progress: 100 }
                : f
            )
          );

          // Add this file as a SEPARATE source with its own unique ID
          processedSources.push({
            id: uuidv4(), // New unique ID for the source
            type: 'upload',
            name: uploadedFile.file.name,
            content,
            timestamp: new Date(),
          });

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to process file';
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id
                ? { ...f, status: 'error', error: errorMessage }
                : f
            )
          );
        }
      }

      // Add ALL successfully processed sources - each as a separate entry
      if (processedSources.length > 0) {
        onSourcesAdd(processedSources);
      }

      setIsProcessing(false);
    },
    [onSourcesAdd]
  );

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md'],
      'text/csv': ['.csv'],
    },
    multiple: true,
    disabled: isProcessing,
  });

  const rootProps = getRootProps();
  const completedCount = uploadedFiles.filter(f => f.status === 'completed').length;
  const errorCount = uploadedFiles.filter(f => f.status === 'error').length;

  return (
    <div className="space-y-4">
      <div
        {...rootProps}
        className={`
          relative p-8 border-2 border-dashed rounded-2xl cursor-pointer
          transition-all duration-300 text-center transform hover:scale-[1.01] active:scale-[0.99]
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
          ${
            isDragActive
              ? 'border-violet-500 bg-violet-500/10'
              : 'border-white/20 hover:border-violet-500/50 hover:bg-white/5'
          }
        `}
      >
        <input {...getInputProps()} />

        <motion.div
          animate={isDragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center">
            {isProcessing ? (
              <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
            ) : (
              <Upload className={`w-8 h-8 ${isDragActive ? 'text-violet-400' : 'text-white/60'}`} />
            )}
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">
            {isProcessing ? 'Processing files...' : isDragActive ? 'Drop your files here' : 'Upload Source Documents'}
          </h3>

          <p className="text-gray-300 text-sm mb-4">
            Drag & drop files or click to browse (each file = separate source)
          </p>

          <div className="flex flex-wrap gap-2 justify-center">
            {['.txt', '.docx', '.doc', '.pdf', '.md', '.csv'].map((ext) => (
              <span
                key={ext}
                className="px-2 py-1 text-xs rounded-lg bg-slate-700/50 text-gray-300 border border-slate-600/50"
              >
                {ext}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Status Summary */}
      {uploadedFiles.length > 0 && (
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400">
            Total: <span className="text-white font-medium">{uploadedFiles.length}</span> files
          </span>
          {completedCount > 0 && (
            <span className="text-emerald-400">
              <Check className="w-4 h-4 inline mr-1" />
              {completedCount} ready
            </span>
          )}
          {errorCount > 0 && (
            <span className="text-red-400">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              {errorCount} failed
            </span>
          )}
        </div>
      )}

      {/* Uploaded Files List */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar"
          >
            {uploadedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`flex items-center gap-3 p-3 rounded-xl border ${
                  file.status === 'completed'
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : file.status === 'error'
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-slate-700/50 border-slate-600/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  file.status === 'completed'
                    ? 'bg-emerald-500/20'
                    : file.status === 'error'
                    ? 'bg-red-500/20'
                    : 'bg-violet-500/20'
                }`}>
                  <FileText className={`w-5 h-5 ${
                    file.status === 'completed'
                      ? 'text-emerald-400'
                      : file.status === 'error'
                      ? 'text-red-400'
                      : 'text-violet-400'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{file.file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {file.status === 'uploading' && (
                      <>
                        <div className="flex-1 h-1.5 bg-slate-600/50 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
                            initial={{ width: '0%' }}
                            animate={{ width: `${file.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{file.progress}%</span>
                      </>
                    )}
                    {file.status === 'processing' && (
                      <span className="flex items-center gap-1 text-xs text-amber-400">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Extracting text from document...
                      </span>
                    )}
                    {file.status === 'completed' && (
                      <span className="flex items-center gap-1 text-xs text-emerald-400">
                        <Check className="w-3 h-3" />
                        Ready - {file.content?.split(/\s+/).filter(Boolean).length.toLocaleString()} words extracted
                      </span>
                    )}
                    {file.status === 'error' && (
                      <span className="flex items-center gap-1 text-xs text-red-400">
                        <AlertCircle className="w-3 h-3" />
                        {file.error}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => removeFile(file.id)}
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
