import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase, STORAGE_BUCKET } from "../lib/supabase";
import { useApiClient } from "../hooks/use-api-client";
import { DocumentType, ApiResponse, Document } from "../types";

interface UploadDocumentDialogProps {
  eventId: string;
  documentTypes: DocumentType[];
  onUploaded: (doc: Document) => void;
}

type UploadStep = "idle" | "uploading-storage" | "registering" | "done" | "error";

export default function UploadDocumentDialog({
  eventId,
  documentTypes,
  onUploaded,
}: UploadDocumentDialogProps) {
  const { post } = useApiClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<UploadStep>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const resetState = () => {
    setSelectedTypeId("");
    setFile(null);
    setStep("idle");
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setStep("idle");
    setErrorMsg("");
  };

  const getFileFormat = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const map: Record<string, string> = {
      pdf: "PDF",
      xls: "Excel",
      xlsx: "Excel",
      doc: "Word",
      docx: "Word",
      csv: "CSV",
      png: "Image",
      jpg: "Image",
      jpeg: "Image",
    };
    return map[ext ?? ""] ?? "PDF";
  };

  const handleUpload = async () => {
    if (!file || !selectedTypeId) return;
    setErrorMsg("");

    try {
      // 1. Upload to Supabase Storage
      setStep("uploading-storage");
      const filePath = `${eventId}/${Date.now()}_${file.name}`;
      const { error: storageErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, { upsert: false });

      if (storageErr) {
        throw new Error(`Storage upload failed: ${storageErr.message}`);
      }

      // 2. Register document in the backend (triggers extraction)
      setStep("registering");
      const response = await post<ApiResponse<Document>>(
        `/api/v1/events/${eventId}/documents`,
        {
          document_type_id: selectedTypeId,
          file_name: file.name,
          file_format: getFileFormat(file),
          file_path: filePath,
        }
      );

      if (!response.data) {
        throw new Error(response.message ?? "Failed to register document");
      }

      setStep("done");
      onUploaded(response.data);

      // Auto-close after short delay
      setTimeout(() => {
        setOpen(false);
        resetState();
      }, 1500);
    } catch (err) {
      setStep("error");
      setErrorMsg(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const isLoading = step === "uploading-storage" || step === "registering";

  const stepLabel: Record<UploadStep, string> = {
    idle: "Upload",
    "uploading-storage": "Uploading file…",
    registering: "Registering document…",
    done: "Done!",
    error: "Retry",
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetState(); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Upload className="w-4 h-4" />
          Upload Document
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Document Type */}
          <div className="space-y-2">
            <Label>Document Type</Label>
            <Select value={selectedTypeId} onValueChange={setSelectedTypeId} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((dt) => (
                  <SelectItem key={dt.id} value={dt.id}>
                    {dt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File picker */}
          <div className="space-y-2">
            <Label>File</Label>
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => !isLoading && fileInputRef.current?.click()}
            >
              {file ? (
                <p className="text-sm font-medium">{file.name}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Click to select a file (PDF, Excel, Word, CSV, Image)
                </p>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.xls,.xlsx,.doc,.docx,.csv,.png,.jpg,.jpeg"
              onChange={handleFileChange}
            />
          </div>

          {/* Status feedback */}
          {step === "done" && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              Document uploaded and queued for extraction!
            </div>
          )}
          {step === "error" && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4" />
              {errorMsg}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => { setOpen(false); resetState(); }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || !selectedTypeId || isLoading || step === "done"}
              className="gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {stepLabel[step]}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
