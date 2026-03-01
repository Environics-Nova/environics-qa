import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  BrainCircuit,
  FileText,
  PanelRightOpen,
  PanelRightClose,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useApiClient, ApiError } from "@/hooks/use-api-client";
import { QAQCProcess, ApiResponse, DocumentType, Document } from "@/types";
import PdfViewer from "@/components/PdfViewer";
import { getSignedUrl } from "@/lib/storage";

/** How often to re-fetch when the process is Pending (ms) */
const PENDING_POLL_INTERVAL = 5000;

const QAQCProcessDetail = () => {
  const { processId } = useParams<{ processId: string }>();
  const navigate = useNavigate();
  const { get, post, isLoaded, hasOrganization } = useApiClient();

  const [process, setProcess] = useState<QAQCProcess | null>(null);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [rerunning, setRerunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // PDF viewer state
  const [selectedDocId, setSelectedDocId] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfPanelOpen, setPdfPanelOpen] = useState(true);

  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Data fetcher ──────────────────────────────────────────────────────────
  const fetchData = useCallback(
    async (silent = false) => {
      if (!isLoaded || !processId) return;
      if (!hasOrganization) {
        setLoading(false);
        setError("Please select an organization to view process details.");
        return;
      }

      if (!silent) setLoading(true);
      setError(null);

      try {
        const processResponse = await get<ApiResponse<QAQCProcess>>(
          `/api/v1/qaqc-processes/${processId}`
        );
        if (processResponse.data) {
          setProcess(processResponse.data);

          // Fetch documents for the event associated with this process
          const eventId =
            processResponse.data.event_id || processResponse.data.event?.id;
          if (eventId) {
            try {
              const docsResponse = await get<
                ApiResponse<Record<string, unknown>>
              >(`/api/v1/events/${eventId}/documents`);
              const docList =
                docsResponse.data?.documents || docsResponse.data;
              const docs = Array.isArray(docList)
                ? (docList as Document[])
                : [];
              setDocuments(docs);

              // Auto-select first PDF document if none selected
              if (!selectedDocId && docs.length > 0) {
                const firstPdf = docs.find((d) => d.file_format === "PDF");
                if (firstPdf) {
                  setSelectedDocId(firstPdf.id);
                }
              }
            } catch {
              // Non-critical: documents fetch failed
            }
          }
        }

        const docTypesResponse = await get<
          ApiResponse<Record<string, unknown>>
        >("/api/v1/document-types");
        const dtList =
          (docTypesResponse.data as Record<string, unknown>)
            ?.document_types || docTypesResponse.data;
        setDocumentTypes(Array.isArray(dtList) ? dtList : []);
      } catch (err) {
        const apiError = err as ApiError;
        if (apiError.status === 404) {
          setError("QA/QC process not found");
        } else {
          setError(apiError.message || "Failed to load process");
        }
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [get, processId, isLoaded, hasOrganization, selectedDocId]
  );

  // ─── Auto-poll while process is Pending ────────────────────────────────────
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);

    if (process?.result === "Pending") {
      pollTimerRef.current = setTimeout(() => {
        fetchData(true);
      }, PENDING_POLL_INTERVAL);
    }

    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, [process, fetchData]);

  // ─── Load PDF for selected document ────────────────────────────────────────
  useEffect(() => {
    const loadPdf = async () => {
      if (!selectedDocId) {
        setPdfUrl(null);
        return;
      }

      const doc = documents.find((d) => d.id === selectedDocId);
      if (!doc?.file_path || doc.file_format !== "PDF") {
        setPdfUrl(null);
        return;
      }

      setPdfLoading(true);
      try {
        const url = await getSignedUrl(doc.file_path);
        setPdfUrl(url);
      } catch {
        setPdfUrl(null);
      } finally {
        setPdfLoading(false);
      }
    };

    loadPdf();
  }, [selectedDocId, documents]);

  // ─── Re-run ────────────────────────────────────────────────────────────────
  const handleReRun = async () => {
    if (!processId) return;
    setRerunning(true);
    try {
      const response = await post<ApiResponse<QAQCProcess>>(
        `/api/v1/qaqc-processes/${processId}/rerun`
      );
      if (response.data) {
        setProcess(response.data);
        toast.success("Process re-run completed successfully");
      }
    } catch (err) {
      const apiError = err as ApiError;
      toast.error(apiError.message || "Failed to re-run process");
    } finally {
      setRerunning(false);
    }
  };

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const getDocumentTypeName = (docTypeId?: string): string => {
    if (!docTypeId) return "Unknown";
    const docType = documentTypes.find((dt) => dt.id === docTypeId);
    return docType?.name || "Unknown";
  };

  const resultIcon = (result: string) => {
    if (result === "Passed")
      return <CheckCircle className="h-4 w-4" />;
    if (result === "Pending")
      return <Clock className="h-4 w-4 animate-pulse" />;
    return <XCircle className="h-4 w-4" />;
  };

  const resultBadgeClass = (result: string) => {
    if (result === "Passed")
      return "bg-emerald-500/15 text-emerald-700 border-emerald-300";
    if (result === "Pending")
      return "bg-amber-500/15 text-amber-700 border-amber-300";
    return "bg-red-500/15 text-red-700 border-red-300";
  };

  const questionIcon = (status: string) => {
    if (status === "Passed")
      return <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />;
    if (status === "Pending")
      return <Clock className="h-3.5 w-3.5 text-amber-600 animate-pulse" />;
    return <XCircle className="h-3.5 w-3.5 text-red-600" />;
  };

  const questionBadgeClass = (status: string) => {
    if (status === "Passed")
      return "bg-emerald-500/10 text-emerald-700 border-emerald-200";
    if (status === "Pending")
      return "bg-amber-500/10 text-amber-700 border-amber-200";
    return "bg-red-500/10 text-red-700 border-red-200";
  };

  // ─── Render states ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading process…</p>
        </div>
      </div>
    );
  }

  if (error || !process) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error || "Process not found"}
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate("/qaqc-processes")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Processes
          </Button>
        </div>
      </div>
    );
  }

  const results = process.results || [];
  const isPending = process.result === "Pending";
  const pdfDocuments = documents.filter((d) => d.file_format === "PDF");
  const hasPdfDocuments = pdfDocuments.length > 0;
  const selectedDoc = documents.find((d) => d.id === selectedDocId);

  // ─── Process Content (left side / main content) ────────────────────────────
  const processContent = (
    <div className="space-y-6">
      {/* Navigation */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/qaqc-processes")}
        className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Processes
      </Button>

      {/* Header card */}
      <div className="space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground truncate">
                {process.name}
              </h1>
              <Badge
                variant="outline"
                className={`flex items-center gap-1 text-xs px-2.5 py-0.5 font-semibold shrink-0 ${resultBadgeClass(
                  process.result
                )}`}
              >
                {resultIcon(process.result)}
                {process.result}
              </Badge>
            </div>
            {process.description && (
              <p className="text-sm text-muted-foreground">
                {process.description}
              </p>
            )}
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap pt-1">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {format(new Date(process.time), "MMM dd, yyyy · HH:mm")}
              </span>
              <span className="text-border">•</span>
              <span>Event: {process.event?.name || "Unknown"}</span>
              <span className="text-border">•</span>
              <span>
                Questionnaire: {process.questionnaire?.name || "Unknown"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Toggle PDF panel */}
            {hasPdfDocuments && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={pdfPanelOpen ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPdfPanelOpen(!pdfPanelOpen)}
                    className="gap-1.5"
                  >
                    {pdfPanelOpen ? (
                      <PanelRightClose className="h-4 w-4" />
                    ) : (
                      <PanelRightOpen className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">
                      {pdfPanelOpen ? "Hide PDF" : "Show PDF"}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {pdfPanelOpen
                    ? "Minimize document preview"
                    : "Show document preview"}
                </TooltipContent>
              </Tooltip>
            )}
            <Button
              onClick={handleReRun}
              disabled={rerunning || isPending}
              variant="outline"
              size="sm"
              className="gap-1.5"
            >
              {rerunning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Re-run
            </Button>
          </div>
        </div>
      </div>

      {/* Pending banner */}
      {isPending && (
        <Alert className="border-amber-300/60 bg-gradient-to-r from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10">
          <BrainCircuit className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 dark:text-amber-400 font-semibold">
            AI Extraction in Progress
          </AlertTitle>
          <AlertDescription className="text-amber-700/80 dark:text-amber-500 text-sm">
            Documents are being analysed by the extraction service. Auto-refreshing every{" "}
            {PENDING_POLL_INTERVAL / 1000}s.{" "}
            <button
              className="underline font-medium hover:text-amber-900 transition-colors"
              onClick={() => fetchData(true)}
            >
              Refresh now
            </button>
          </AlertDescription>
        </Alert>
      )}

      <Separator />

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Question Results
          </h2>
          <span className="text-xs text-muted-foreground">
            {results.length} question{results.length !== 1 ? "s" : ""}
          </span>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <AlertCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No results available for this process.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((result, index) => {
              const question = result.question;
              const doc1Name =
                question?.document_1?.name ||
                getDocumentTypeName(question?.document_1_id);
              const doc2Name =
                question?.document_2?.name ||
                getDocumentTypeName(question?.document_2_id);

              return (
                <Card
                  key={result.id || `${result.question_id}-${index}`}
                  className="overflow-hidden transition-shadow hover:shadow-sm"
                >
                  <CardHeader className="py-3 px-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-semibold text-foreground">
                        Question {index + 1}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1 text-xs font-medium ${questionBadgeClass(
                          result.status
                        )}`}
                      >
                        {questionIcon(result.status)}
                        {result.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="py-3 px-4 pt-0 space-y-3">
                    <div className="bg-muted/60 p-3 rounded-md">
                      <p className="text-sm text-foreground leading-relaxed">
                        <span className="font-medium text-primary">
                          {question?.property_1 || "Property"}
                        </span>{" "}
                        in{" "}
                        <span className="font-medium text-primary">
                          {doc1Name}
                        </span>{" "}
                        <span className="text-muted-foreground font-mono text-xs px-1.5 py-0.5 rounded bg-muted">
                          {question?.relation || "?"}
                        </span>{" "}
                        <span className="font-medium text-primary">
                          {question?.document_2_id || question?.document_2
                            ? `${question?.property_2 || "Property"} in ${doc2Name}`
                            : question?.comparison_value || "Value"}
                        </span>
                      </p>
                    </div>

                    {result.status === "Failed" && result.comment && (
                      <div className="border-l-2 border-destructive/60 pl-3 py-1">
                        <p className="text-xs font-medium text-destructive mb-0.5">
                          Failure Reason
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {result.comment}
                        </p>
                      </div>
                    )}

                    {result.status === "Pending" && result.comment && (
                      <div className="border-l-2 border-amber-400/60 pl-3 py-1">
                        <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-0.5 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Waiting for AI
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {result.comment}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // ─── PDF panel (right side) ────────────────────────────────────────────────
  const pdfPanel = (
    <div className="h-full flex flex-col bg-muted/10">
      {/* Document selector header */}
      <div className="px-3 py-2.5 border-b border-border bg-card flex items-center gap-2 shrink-0">
        <Eye className="h-4 w-4 text-muted-foreground shrink-0" />
        {pdfDocuments.length > 1 ? (
          <Select value={selectedDocId} onValueChange={setSelectedDocId}>
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue placeholder="Select document…" />
            </SelectTrigger>
            <SelectContent>
              {pdfDocuments.map((doc) => (
                <SelectItem key={doc.id} value={doc.id}>
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate">{doc.file_name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-xs font-medium text-foreground truncate flex-1">
            {selectedDoc?.file_name || "Document Preview"}
          </span>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => setPdfPanelOpen(false)}
            >
              <PanelRightClose className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Minimize preview</TooltipContent>
        </Tooltip>
      </div>

      {/* PDF viewer */}
      <div className="flex-1 min-h-0">
        {pdfLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">Loading PDF…</p>
            </div>
          </div>
        ) : selectedDocId ? (
          <PdfViewer
            url={pdfUrl}
            title={selectedDoc?.file_name}
            isProcessing={isPending}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6">
            <FileText className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-xs">No document selected</p>
          </div>
        )}
      </div>
    </div>
  );

  // ─── Layout ────────────────────────────────────────────────────────────────
  if (hasPdfDocuments) {
    return (
      <div className="h-[calc(100vh-3rem)] flex flex-col">
        {pdfPanelOpen ? (
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            {/* Left: Process details (primary) */}
            <ResizablePanel defaultSize={55} minSize={30}>
              <ScrollArea className="h-full">
                <div className="p-6 max-w-3xl">{processContent}</div>
              </ScrollArea>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Right: PDF viewer (collapsible) */}
            <ResizablePanel defaultSize={45} minSize={20}>
              {pdfPanel}
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          /* Panel collapsed — full-width process details */
          <ScrollArea className="flex-1">
            <div className="p-6 max-w-4xl mx-auto">{processContent}</div>
          </ScrollArea>
        )}
      </div>
    );
  }

  // No PDF documents: standard single-column layout
  return (
    <ScrollArea className="h-[calc(100vh-3rem)]">
      <div className="p-6 max-w-4xl mx-auto">{processContent}</div>
    </ScrollArea>
  );
};

export default QAQCProcessDetail;
