"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import useApiClient from "@/hooks/useApiClient";
import { toast } from "sonner";

export interface UploadedFile {
  key: string;
  url: string;
}

interface FileUploaderProps {
  onFilesChange: (files: UploadedFile[]) => void;
}

interface FileUpload {
  file: File;
  progress: number;
  key: string | null;
}

export function FileUploader({ onFilesChange }: FileUploaderProps) {
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const apiClient = useApiClient();

  const startUpload = async (file: File) => {
    const uploadId = Date.now() + file.name;
    const newUpload: FileUpload = { file, progress: 0, key: null };
    setUploads((prev) => [...prev, newUpload]);

    try {
      // 1. Get presigned URL
      const presignResponse = await apiClient.post("/uploads/presign", {
        filename: file.name,
        contentType: file.type,
      });
      const { url, key } = presignResponse.data;

      // 2. Upload to S3
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url, true);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploads((prev) =>
            prev.map((u) => (u.file === file ? { ...u, progress: percentComplete } : u))
          );
        }
      };
      xhr.onload = () => {
        if (xhr.status === 200) {
          setUploads((prev) =>
            prev.map((u) => (u.file === file ? { ...u, progress: 100, key } : u))
          );
          const completedUploads = [
            ...uploads.filter(u => u.key).map(u => ({ key: u.key!, url: '' })),
            { key, url: '' }
          ];
          onFilesChange(completedUploads);
        } else {
          toast.error(`Upload failed for ${file.name}`);
        }
      };
      xhr.onerror = () => toast.error(`Upload error for ${file.name}`);
      xhr.send(file);
    } catch (error) {
      toast.error(`Could not get an upload URL for ${file.name}`);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(startUpload);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer
        ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/50"}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
        <p className="mb-2 text-sm text-muted-foreground">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-muted-foreground">PNG, JPG, or GIF</p>
      </div>
      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((upload, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium truncate">{upload.file.name}</p>
                <Progress value={upload.progress} />
              </div>
              <Button variant="ghost" size="icon" onClick={() => setUploads(uploads.filter((_, i) => i !== index))}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}