import { useRef, useState } from "react";
import { Upload, CheckCircle2, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Props {
  label: string;
  applicationId: string | null;
  field: string;
  currentName?: string;
  currentPath?: string;
  onUploaded: (path: string, name: string) => void;
  onCleared: () => void;
}

const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPT = "application/pdf,image/png,image/jpeg";

export const FileUploadField = ({
  label,
  applicationId,
  field,
  currentName,
  currentPath,
  onUploaded,
  onCleared,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_SIZE) {
      toast({ title: "File too large", description: "Maximum 10 MB.", variant: "destructive" });
      return;
    }
    if (!applicationId) {
      toast({ title: "Save in progress", description: "Please wait a moment and try again." });
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${applicationId}/${field}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("agent-onboarding-uploads")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      onUploaded(path, file.name);
      toast({ title: "Uploaded", description: file.name });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-md border border-[#D8DEE7] bg-[#FAFBFC]">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={handleSelect}
      />
      {currentPath ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span className="text-xs flex-1 truncate text-[#1E3A5F] font-medium">
            {currentName ?? "Uploaded"}
          </span>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-xs text-[#1E3A5F] hover:underline"
          >
            Replace
          </button>
          <button type="button" onClick={onCleared} className="text-[#98A2B3] hover:text-red-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 text-xs text-[#1E3A5F] font-medium"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 text-[#E4B548]" />
          )}
          <span>
            <b>Attach</b> {label}
          </span>
          <span className="text-[#98A2B3]">PDF / JPG / PNG · 10 MB max</span>
        </button>
      )}
    </div>
  );
};