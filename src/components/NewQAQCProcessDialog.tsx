import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Loader2,
  UploadCloud,
  FileText,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  X,
  RefreshCw,
} from "lucide-react";
import { useApiClient, ApiError } from "@/hooks/use-api-client";
import {
  QAQCProcess,
  Questionnaire,
  Event,
  ApiResponse,
  CreateQAQCProcessRequest,
  DocumentType,
  Document,
} from "@/types";
import { supabase, STORAGE_BUCKET } from "@/lib/supabase";

interface NewQAQCProcessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProcessCreated?: (process: QAQCProcess) => void;
}

const getFileFormat = (fileName: string): string => {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
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
  return map[ext] ?? "PDF";
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

type FileUploadStatus = "pending" | "uploading" | "success" | "error";

interface UploadFileState {
  id: string;
  file: File;
  status: FileUploadStatus;
  progress: number;
  documentTypeId: string;
  error?: string;
  serverDoc?: Document;
}

const NewQAQCProcessDialog = ({
  open,
  onOpenChange,
  onProcessCreated,
}: NewQAQCProcessDialogProps) => {
  const { get, post, hasOrganization } = useApiClient();

  // Step state
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");

  // Data
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [existingDocuments, setExistingDocuments] = useState<Document[]>([]);

  // Upload queue
  const [uploadFiles, setUploadFiles] = useState<UploadFileState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Loading flags
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [checkingDocs, setCheckingDocs] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Keep a ref to the current event ID to avoid stale closures inside upload fn
  const eventIdRef = useRef(selectedEventId);
  useEffect(() => { eventIdRef.current = selectedEventId; }, [selectedEventId]);

  // Keep a ref to the first document type id
  const defaultDocTypeRef = useRef("");
  useEffect(() => {
    defaultDocTypeRef.current = documentTypes.length > 0 ? documentTypes[0].id : "";
  }, [documentTypes]);

  // ─── Load initial data ────────────────────────────────────────────────────
  useEffect(() => {
    if (!open || !hasOrganization) return;
    let cancelled = false;

    const load = async () => {
      setLoadingInitial(true);
      setStep(1);
      setUploadFiles([]);
      setSelectedQuestionnaireId("");
      setSelectedEventId("");
      setName("");
      setDescription("");

      try {
        const [qRes, pRes, dtRes] = await Promise.all([
          get<ApiResponse<Record<string, unknown>>>("/api/v1/questionnaires"),
          get<ApiResponse<Record<string, unknown>>>("/api/v1/projects"),
          get<ApiResponse<Record<string, unknown>>>("/api/v1/document-types"),
        ]);

        if (cancelled) return;

        const qList = qRes.data?.questionnaires ?? qRes.data;
        setQuestionnaires(Array.isArray(qList) ? (qList as Questionnaire[]) : []);

        const dtList = dtRes.data?.document_types ?? dtRes.data;
        setDocumentTypes(Array.isArray(dtList) ? (dtList as DocumentType[]) : []);

        const rawProjects = pRes.data?.projects ?? pRes.data;
        const projects = Array.isArray(rawProjects) ? rawProjects : [];
        const allEvents: Event[] = [];

        for (const proj of projects as any[]) {
          try {
            const eRes = await get<ApiResponse<Record<string, unknown>>>(
              `/api/v1/projects/${proj.id}/events`,
            );
            const evts = Array.isArray(eRes.data?.events)
              ? eRes.data.events
              : Array.isArray(eRes.data)
              ? eRes.data
              : [];
            evts.forEach((e: any) => allEvents.push(e as Event));
          } catch {/* skip */ }
        }
        if (!cancelled) setEvents(allEvents);
      } catch {
        if (!cancelled) toast.error("Failed to load initial data");
      } finally {
        if (!cancelled) setLoadingInitial(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [open, hasOrganization]); // eslint-disable-line

  // ─── Load existing docs when event chosen ────────────────────────────────
  useEffect(() => {
    if (!selectedEventId || step !== 2) return;
    let cancelled = false;

    const check = async () => {
      setCheckingDocs(true);
      try {
        const res = await get<ApiResponse<Record<string, unknown>>>(
          `/api/v1/events/${selectedEventId}/documents`,
        );
        const docs =
          Array.isArray(res.data?.documents)
            ? res.data.documents
            : Array.isArray(res.data)
            ? res.data
            : [];
        if (!cancelled) setExistingDocuments(docs as Document[]);
      } catch {
        if (!cancelled) toast.error("Failed to load event documents");
      } finally {
        if (!cancelled) setCheckingDocs(false);
      }
    };
    check();
    return () => { cancelled = true; };
  }, [selectedEventId, step]); // eslint-disable-line

  // ─── Upload a single file ─────────────────────────────────────────────────
  const uploadSingleFile = useCallback(
    async (fileState: UploadFileState) => {
      const eventId = eventIdRef.current;

      if (!fileState.documentTypeId) {
        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === fileState.id
              ? { ...f, status: "error", error: "Please select a document type" }
              : f,
          ),
        );
        return;
      }

      // Mark as uploading
      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === fileState.id ? { ...f, status: "uploading", progress: 10 } : f,
        ),
      );

      try {
        // Step 1 – upload to Supabase Storage
        const filePath = `${eventId}/${Date.now()}_${fileState.file.name}`;

        setUploadFiles((prev) =>
          prev.map((f) => (f.id === fileState.id ? { ...f, progress: 40 } : f)),
        );

        const { error: storageErr } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, fileState.file, { upsert: true });

        if (storageErr) throw new Error(`Storage: ${storageErr.message}`);

        setUploadFiles((prev) =>
          prev.map((f) => (f.id === fileState.id ? { ...f, progress: 75 } : f)),
        );

        // Step 2 – register via backend API
        const response = await post<ApiResponse<Document>>(
          `/api/v1/events/${eventId}/documents`,
          {
            document_type_id: fileState.documentTypeId,
            file_name: fileState.file.name,
            file_format: getFileFormat(fileState.file.name),
            file_path: filePath,
          },
        );

        if (!response.success || !response.data) {
          throw new Error(response.error ?? "Failed to register document");
        }

        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === fileState.id
              ? { ...f, status: "success", progress: 100, serverDoc: response.data }
              : f,
          ),
        );
      } catch (err: any) {
        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === fileState.id
              ? { ...f, status: "error", error: err.message ?? "Upload failed" }
              : f,
          ),
        );
      }
    },
    [post], // eslint-disable-line
  );

  // ─── Add files to queue and start uploading ───────────────────────────────
  const addFiles = useCallback(
    (files: File[]) => {
      if (files.length === 0) return;

      const defaultDocType = defaultDocTypeRef.current;
      const newItems: UploadFileState[] = files.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        status: "pending",
        progress: 0,
        documentTypeId: defaultDocType,
      }));

      setUploadFiles((prev) => [...prev, ...newItems]);

      // Upload each new file immediately
      newItems.forEach((item) => uploadSingleFile(item));
    },
    [uploadSingleFile],
  );

  // ─── Drag & drop handlers ─────────────────────────────────────────────────
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };
  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
      e.target.value = ""; // allow re-selecting same file
    }
  };

  // ─── Retry a single failed file ───────────────────────────────────────────
  const retryFile = useCallback(
    (fileState: UploadFileState) => {
      const reset: UploadFileState = {
        ...fileState,
        status: "pending",
        progress: 0,
        error: undefined,
      };
      setUploadFiles((prev) =>
        prev.map((f) => (f.id === fileState.id ? reset : f)),
      );
      uploadSingleFile(reset);
    },
    [uploadSingleFile],
  );

  // ─── Wizard navigation ────────────────────────────────────────────────────
  const handleNext = () => {
    if (step === 1) {
      if (!name.trim() || !selectedQuestionnaireId || !selectedEventId) {
        toast.error("Please fill in all required fields");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const successCount = uploadFiles.filter((f) => f.status === "success").length;
      const totalDocs = existingDocuments.length + successCount;
      if (totalDocs === 0) {
        toast.error("At least one document must be in the event to run QA/QC");
        return;
      }
      const inProgress = uploadFiles.some(
        (f) => f.status === "pending" || f.status === "uploading",
      );
      if (inProgress) {
        toast.error("Please wait for all uploads to finish");
        return;
      }
      setStep(3);
    }
  };

  const handleCancel = () => {
    setStep(1);
    setName("");
    setDescription("");
    setSelectedQuestionnaireId("");
    setSelectedEventId("");
    setUploadFiles([]);
    onOpenChange(false);
  };

  // ─── Final submission ─────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const body: CreateQAQCProcessRequest = {
        name,
        description: description || undefined,
        questionnaire_id: selectedQuestionnaireId,
        event_id: selectedEventId,
      };
      const res = await post<ApiResponse<QAQCProcess>>("/api/v1/qaqc-processes", body);
      if (res.data) {
        toast.success("QA/QC Process initiated successfully!");
        onProcessCreated?.(res.data);
        handleCancel();
      }
    } catch (err) {
      toast.error((err as ApiError).message ?? "Failed to create QA/QC process");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Derived values ───────────────────────────────────────────────────────
  const selectedQuestionnaire = questionnaires.find(
    (q) => q.id === selectedQuestionnaireId,
  );
  const filteredEvents = selectedQuestionnaire?.event_type
    ? events.filter((e) =>
        e.event_types.includes(selectedQuestionnaire.event_type!),
      )
    : events;
  const selectedEvent = events.find((e) => e.id === selectedEventId);
  const uploadedCount =
    existingDocuments.length +
    uploadFiles.filter((f) => f.status === "success").length;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] p-0 overflow-hidden gap-0">
        {/* ── Header ribbon with step indicator ── */}
        <div className="bg-muted px-6 py-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-lg">New QA/QC Process</DialogTitle>
            <DialogDescription className="sr-only">
              Create a new QA/QC process in 3 steps
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-1 mt-3 text-xs font-medium">
            {[
              { n: 1, label: "Setup" },
              { n: 2, label: "Documents" },
              { n: 3, label: "Review" },
            ].map(({ n, label }, i) => (
              <div key={n} className="flex items-center gap-1">
                {i > 0 && (
                  <div
                    className={`h-px w-8 rounded ${step > i ? "bg-primary" : "bg-border"}`}
                  />
                )}
                <div
                  className={`flex items-center gap-1.5 ${step >= n ? "text-primary" : "text-muted-foreground"}`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold border transition-colors
                      ${step > n ? "bg-primary border-primary text-primary-foreground" : step === n ? "border-primary text-primary" : "border-muted-foreground"}`}
                  >
                    {step > n ? "✓" : n}
                  </span>
                  <span>{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="px-6 py-5 max-h-[62vh] overflow-y-auto">
          {loadingInitial ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading data…</p>
            </div>
          ) : (
            <>
              {/* ────────── STEP 1: SETUP ────────── */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="proc-name">Process Name *</Label>
                    <Input
                      id="proc-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Q1 Site Audit"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="proc-desc">
                      Description{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </Label>
                    <Textarea
                      id="proc-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief details about this process…"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Questionnaire *</Label>
                      <Select
                        value={selectedQuestionnaireId}
                        onValueChange={setSelectedQuestionnaireId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ruleset…" />
                        </SelectTrigger>
                        <SelectContent>
                          {questionnaires.map((q) => (
                            <SelectItem key={q.id} value={q.id}>
                              <div className="flex flex-col text-left">
                                <span className="font-medium">{q.name}</span>
                                {q.event_type && (
                                  <span className="text-xs text-muted-foreground">
                                    Type: {q.event_type}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Target Event *</Label>
                      <Select
                        value={selectedEventId}
                        onValueChange={setSelectedEventId}
                        disabled={!selectedQuestionnaireId}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              selectedQuestionnaireId
                                ? "Select event…"
                                : "Choose questionnaire first"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredEvents.map((ev) => (
                            <SelectItem key={ev.id} value={ev.id}>
                              <div className="flex flex-col text-left">
                                <span className="font-medium">{ev.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {ev.project?.name ?? "Project"}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedQuestionnaire?.event_type && (
                        <p className="text-xs text-muted-foreground pl-0.5">
                          Filtered to {selectedQuestionnaire.event_type} events
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ────────── STEP 2: DOCUMENTS ────────── */}
              {step === 2 && (
                <div className="space-y-5">
                  {checkingDocs ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                      <Loader2 className="w-7 h-7 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Checking event documents…
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Status banner */}
                      {existingDocuments.length > 0 ? (
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-primary text-sm">
                              {existingDocuments.length} document
                              {existingDocuments.length !== 1 ? "s" : ""} already
                              linked
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              You can add more below if needed.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                          <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-orange-500 text-sm">
                              No documents found
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Upload at least one document to proceed.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Drop zone */}
                      <div
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                          relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center
                          justify-center text-center cursor-pointer transition-all duration-200
                          ${isDragging
                            ? "border-primary bg-primary/5 scale-[1.01]"
                            : "border-muted-foreground/25 bg-muted/20 hover:bg-muted/40 hover:border-muted-foreground/40"}
                        `}
                      >
                        <UploadCloud
                          className={`w-10 h-10 mb-2 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground"}`}
                        />
                        <p className="font-semibold text-sm">
                          {isDragging ? "Release to upload" : "Drag & drop files here"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          or click to browse — PDF, Word, Excel, CSV, Image
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          className="hidden"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.csv"
                          onChange={onFileInputChange}
                        />
                      </div>

                      {/* Upload queue */}
                      {uploadFiles.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              Upload queue ({uploadFiles.length})
                            </p>
                            {uploadFiles.some(
                              (f) => f.status === "error",
                            ) && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={() =>
                                  uploadFiles
                                    .filter((f) => f.status === "error")
                                    .forEach(retryFile)
                                }
                              >
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Retry all failed
                              </Button>
                            )}
                          </div>

                          <div className="space-y-2 max-h-48 overflow-y-auto pr-0.5">
                            {uploadFiles.map((fState) => (
                              <div
                                key={fState.id}
                                className={`flex items-center gap-3 p-3 rounded-lg border bg-card shadow-sm transition-colors
                                  ${fState.status === "error" ? "border-destructive/40 bg-destructive/5" : ""}
                                  ${fState.status === "success" ? "border-green-500/30 bg-green-500/5" : ""}
                                `}
                              >
                                {/* Icon */}
                                <div className="shrink-0">
                                  <FileText className="w-8 h-8 text-blue-400 bg-blue-500/10 p-1.5 rounded" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium truncate">
                                      {fState.file.name}
                                    </p>
                                    <span className="text-xs text-muted-foreground shrink-0">
                                      {formatFileSize(fState.file.size)}
                                    </span>
                                  </div>

                                  {/* Progress bar (uploading) */}
                                  {fState.status === "uploading" && (
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                                        <div
                                          className="h-full bg-primary rounded-full transition-all duration-300"
                                          style={{ width: `${fState.progress}%` }}
                                        />
                                      </div>
                                      <span className="text-xs text-muted-foreground shrink-0">
                                        {fState.progress}%
                                      </span>
                                    </div>
                                  )}

                                  {/* Doc type selector — only editable when pending or error */}
                                  {(fState.status === "pending" ||
                                    fState.status === "error") && (
                                    <Select
                                      value={fState.documentTypeId}
                                      onValueChange={(val) =>
                                        setUploadFiles((prev) =>
                                          prev.map((f) =>
                                            f.id === fState.id
                                              ? { ...f, documentTypeId: val }
                                              : f,
                                          ),
                                        )
                                      }
                                    >
                                      <SelectTrigger className="h-6 text-xs px-2 w-40">
                                        <SelectValue placeholder="Select type…" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {documentTypes.map((dt) => (
                                          <SelectItem
                                            key={dt.id}
                                            value={dt.id}
                                            className="text-xs"
                                          >
                                            {dt.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}

                                  {/* Status labels */}
                                  {fState.status === "success" && (
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Uploaded successfully
                                    </p>
                                  )}
                                  {fState.status === "error" && (
                                    <p className="text-xs text-destructive">
                                      ✗ {fState.error}
                                    </p>
                                  )}
                                  {fState.status === "uploading" && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                      Uploading…
                                    </p>
                                  )}
                                </div>

                                {/* Actions */}
                                <div className="shrink-0 flex gap-1">
                                  {fState.status === "error" && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-muted-foreground hover:text-primary"
                                      onClick={() => retryFile(fState)}
                                    >
                                      <RefreshCw className="w-3.5 h-3.5" />
                                    </Button>
                                  )}
                                  {fState.status !== "uploading" && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                      onClick={() =>
                                        setUploadFiles((prev) =>
                                          prev.filter((f) => f.id !== fState.id),
                                        )
                                      }
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ────────── STEP 3: REVIEW ────────── */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="rounded-xl border overflow-hidden">
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                            Process Name
                          </p>
                          <p className="font-semibold">{name}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                            Questionnaire
                          </p>
                          <p className="font-semibold">
                            {selectedQuestionnaire?.name}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                            Target Event
                          </p>
                          <p className="font-semibold">{selectedEvent?.name}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                            Documents Linked
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="bg-primary/15 text-primary font-bold rounded-full px-2.5 py-0.5 text-sm">
                              {uploadedCount}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ready for AI
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted/50 border-t px-5 py-4 flex gap-3">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Clicking <strong>Initiate Process</strong> will run your
                        questionnaire rules against all linked documents via our
                        extraction agent.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 bg-muted/30 border-t flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={step === 1 ? handleCancel : () => setStep((step - 1) as 1 | 2)}
            disabled={submitting}
          >
            {step === 1 ? (
              "Cancel"
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </>
            )}
          </Button>

          {step < 3 ? (
            <Button onClick={handleNext} disabled={loadingInitial || checkingDocs}>
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Initiate Process
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewQAQCProcessDialog;
