import React, { useEffect, useId, useRef, useState } from 'react';

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeBytes?: number;
  acceptedTypes?: string[];
  acceptedExtensions?: string[];
  label?: string;
  required?: boolean;
  className?: string;
  onError?: (message: string) => void;
}

export default function FileUpload({
  files,
  onFilesChange,
  maxFiles = 3,
  maxSizeBytes = 50 * 1024 * 1024, // 50MB
  acceptedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'],
  acceptedExtensions = ['.jpg', '.jpeg', '.png', '.mp4', '.mov', '.avi', '.mkv'],
  label = "Lampiran foto/video (opsional)",
  required = false,
  className = "",
  onError
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadId = useId();
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    // Check if adding these files would exceed the limit
    if (files.length + selectedFiles.length > maxFiles) {
      const errorMsg = `Maksimal ${maxFiles} file yang dapat diunggah`;
      if (onError) onError(errorMsg);
      return;
    }

    const newFiles: File[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      // Check file type and extension
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidType = acceptedTypes.includes(file.type);
      const isValidExtension = acceptedExtensions.some(ext => ext.toLowerCase() === fileExtension);
      
      if (!isValidType && !isValidExtension) {
        const extensions = acceptedExtensions.join(', ').toUpperCase();
        const errorMsg = `Hanya file ${extensions} yang diizinkan`;
        if (onError) onError(errorMsg);
        continue;
      }
      
      if (file.size > maxSizeBytes) {
        const sizeMB = Math.round(maxSizeBytes / (1024 * 1024));
        const errorMsg = `Ukuran file tidak boleh melebihi ${sizeMB}MB`;
        if (onError) onError(errorMsg);
        continue;
      }
      
      newFiles.push(file);
    }

    // Add the valid files to the array
    onFilesChange([...files, ...newFiles]);
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File, index: number) => {
    // Check if it's an image
    const isImage = file.type.startsWith('image/') || ['.jpg', '.jpeg', '.png'].some(ext => file.name.toLowerCase().endsWith(ext));
    // Check if it's a video
    const isVideo = file.type.startsWith('video/') || ['.mp4', '.mov', '.avi', '.mkv'].some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (isImage) {
      return (
        <img 
          src={previewUrls[index]}
          alt={`Pratinjau ${file.name}`}
          className="w-full h-full object-cover" 
        />
      );
    } else if (isVideo) {
      return (
        <div className="relative w-full h-full bg-black">
          <video 
            className="w-full h-full object-cover"
            preload="metadata"
            muted
          >
            <source src={`${previewUrls[index]}#t=0.1`} type={file.type} />
          </video>
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <svg className="w-8 h-8 text-placeholder" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }
  };

  return (
    <div className={className}>
      {label && (
        <label htmlFor={uploadId} className="block text-foreground font-medium mb-2">
          {label} {required && <span className="text-destructive-strong">*</span>}
        </label>
      )}
      
      <div className="flex items-center flex-wrap gap-3">
        <label htmlFor={uploadId} className="flex items-center justify-center px-4 py-2 bg-muted text-foreground rounded-lg cursor-pointer hover:bg-border-strong transition-colors focus-within:ring-2 focus-within:ring-primary">
          <span>Pilih file</span>
          <input 
            id={uploadId}
            type="file" 
            accept={acceptedExtensions.join(',')} 
            className="sr-only"
            onChange={handleFileChange}
            ref={fileInputRef}
            multiple
          />
        </label>
        <span className="text-muted-foreground">
          {files.length > 0 ? `${files.length} file dipilih` : 'Belum ada file dipilih'}
        </span>
      </div>
      
      <p className="text-muted-foreground text-sm mt-2">
        Format yang didukung: {acceptedExtensions.join(', ').toUpperCase()}. 
        Maksimal {Math.round(maxSizeBytes / (1024 * 1024))}MB per file. 
        Maksimal {maxFiles} file.
      </p>
      
      {files.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {files.map((file, index) => (
            <div key={index} className="relative group w-24">
              <div className="w-20 h-20 rounded overflow-hidden border border-input">
                {getFileIcon(file, index)}
              </div>
              
              <div className="absolute -top-2 -right-2 flex gap-1">
                <span className="bg-neutral text-white text-xs px-1 py-0.5 rounded shadow">
                  {file.type.startsWith('image/') ? 'IMG' : 'VID'}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive transition-colors shadow"
                  title="Hapus file"
                  aria-label={`Hapus file ${file.name}`}
                >
                  ×
                </button>
              </div>
              
              <div className="mt-1 text-xs text-muted-foreground">
                <div className="truncate text-foreground" title={file.name}>{file.name}</div>
                <div>{formatFileSize(file.size)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
