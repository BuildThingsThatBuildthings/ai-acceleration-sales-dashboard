'use client';

import { useState, useCallback } from 'react';
import { Upload, FileJson, X, AlertCircle } from 'lucide-react';

interface JsonUploaderProps {
  onUpload: (jsonString: string, fileName: string) => void;
  accept?: string;
}

export default function JsonUploader({ onUpload, accept = '.json' }: JsonUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);

    if (!file.name.endsWith('.json')) {
      setError('Please upload a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        // Validate JSON
        JSON.parse(content);
        setFileName(file.name);
        onUpload(content, file.name);
      } catch {
        setError('Invalid JSON format');
      }
    };
    reader.onerror = () => {
      setError('Error reading file');
    };
    reader.readAsText(file);
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const clearFile = useCallback(() => {
    setFileName(null);
    setError(null);
  }, []);

  return (
    <div className="w-full">
      {fileName ? (
        <div className="bg-green-900/20 border border-green-800/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileJson className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-white font-medium">{fileName}</p>
              <p className="text-green-400 text-sm">File loaded successfully</p>
            </div>
          </div>
          <button
            onClick={clearFile}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>
      ) : (
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`block w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-900/20'
              : 'border-neutral-700 hover:border-neutral-600 hover:bg-neutral-900/50'
          }`}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
          />
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-400' : 'text-neutral-500'}`} />
          <p className="text-white font-medium mb-1">
            {isDragging ? 'Drop your file here' : 'Drag & drop your JSON file'}
          </p>
          <p className="text-neutral-500 text-sm">
            or click to browse
          </p>
          <p className="text-neutral-600 text-xs mt-2">
            Supports .tmp/clean_leads.json or .tmp/scraped_leads.json
          </p>
        </label>
      )}

      {error && (
        <div className="mt-4 bg-red-900/20 border border-red-800/30 rounded-lg p-3 flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
}
