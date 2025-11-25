'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Check, AlertCircle } from 'lucide-react';
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

  const processFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      if (file.type === 'application/pdf') {
        // For PDF, we'll read as text (in production, you'd use a PDF parser)
        reader.readAsText(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: uuidv4(),
        file,
        status: 'uploading' as const,
        progress: 0,
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Process each file
      for (const uploadedFile of newFiles) {
        try {
          // Simulate upload progress
          for (let i = 0; i <= 100; i += 20) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.id === uploadedFile.id ? { ...f, progress: i, status: 'uploading' } : f
              )
            );
          }

          // Process file
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === uploadedFile.id ? { ...f, status: 'processing' } : f))
          );

          const content = await processFile(uploadedFile.file);

          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id
                ? { ...f, status: 'completed', content, progress: 100 }
                : f
            )
          );

          // Create source
          const newSource: Source = {
            id: uploadedFile.id,
            type: 'upload',
            name: uploadedFile.file.name,
            content,
            timestamp: new Date(),
          };

          onSourcesAdd([newSource]);
        } catch (error) {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id
                ? { ...f, status: 'error', error: 'Failed to process file' }
                : f
            )
          );
        }
      }
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
  });

  const rootProps = getRootProps();

  return (
    <div className="space-y-4">
      <div
        {...rootProps}
        className={`
          relative p-8 border-2 border-dashed rounded-2xl cursor-pointer
          transition-all duration-300 text-center transform hover:scale-[1.01] active:scale-[0.99]
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
            <Upload className={`w-8 h-8 ${isDragActive ? 'text-violet-400' : 'text-white/60'}`} />
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">
            {isDragActive ? 'Drop your files here' : 'Upload Source Documents'}
          </h3>

          <p className="text-white/60 text-sm mb-4">
            Drag & drop files or click to browse
          </p>

          <div className="flex flex-wrap gap-2 justify-center">
            {['.txt', '.pdf', '.doc', '.docx', '.md', '.csv'].map((ext) => (
              <span
                key={ext}
                className="px-2 py-1 text-xs rounded-lg bg-white/5 text-white/40"
              >
                {ext}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Uploaded Files List */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {uploadedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-violet-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{file.file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {file.status === 'uploading' && (
                      <>
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
                            initial={{ width: '0%' }}
                            animate={{ width: `${file.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/40">{file.progress}%</span>
                      </>
                    )}
                    {file.status === 'processing' && (
                      <span className="text-xs text-amber-400">Processing...</span>
                    )}
                    {file.status === 'completed' && (
                      <span className="flex items-center gap-1 text-xs text-emerald-400">
                        <Check className="w-3 h-3" /> Ready
                      </span>
                    )}
                    {file.status === 'error' && (
                      <span className="flex items-center gap-1 text-xs text-red-400">
                        <AlertCircle className="w-3 h-3" /> {file.error}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => removeFile(file.id)}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
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
