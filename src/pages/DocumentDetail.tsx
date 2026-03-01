import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ScrollArea } from "../components/ui/scroll-area";
import { StatusBadge } from "../components/StatusBadge";
import PdfViewer from "../components/PdfViewer";
import {
  ArrowLeft,
  Save,
  Edit,
  FileText,
  Upload,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useApiClient, ApiError } from "../hooks/use-api-client";
import { Document as DocType, ApiResponse, UpdateDocumentRequest } from "../types";
import { getSignedUrl } from "../lib/storage";
import { EXTRACTION_POLL_INTERVAL_MS } from "../constants";

const DocumentDetail = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { get, put, post, hasOrganization, isLoaded } = useApiClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [document, setDocument] = useState<DocType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState<
    Record<string, string | number | boolean | null>
  >({});

  // PDF viewer state
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  // ── Fetch document ───────────────────────────
  const fetchDocument = useCallback(async () => {
    if (!isLoaded || !documentId) return;
    if (!hasOrganization) {
      setLoading(false);
      setError("Please select an organization to view document details.");
      return;
    }

    try {
      const response = await get<ApiResponse<DocType>>(
        `/api/v1/documents/${documentId}`
      );
      if (response.data) {
        setDocument(response.data);
        setEditedValues(response.data.properties_values || {});
      }
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 404) {
        setError("Document not found");
      } else {
        setError(apiError.message || "Failed to load document");
      }
    } finally {
      setLoading(false);
    }
  }, [get, documentId, hasOrganization, isLoaded]);

  // Initial fetch
  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  // ── Generate PDF signed URL ──────────────────
  useEffect(() => {
    const generateUrl = async () => {
      if (!document?.file_path) return;

      // Only show PDF for PDF files
      if (document.file_format !== "PDF") return;

      setPdfLoading(true);
      try {
        const url = await getSignedUrl(document.file_path);
        setPdfUrl(url);
      } catch {
        console.error("Failed to generate PDF URL");
      } finally {
        setPdfLoading(false);
      }
    };

    generateUrl();
  }, [document?.file_path, document?.file_format]);

  // ── Poll for extraction completion ───────────
  useEffect(() => {
    if (!document || document.status !== "Processing") return;

    const interval = setInterval(async () => {
      try {
        const response = await get<ApiResponse<DocType>>(
          `/api/v1/documents/${documentId}`
        );
        if (response.data) {
          setDocument(response.data);
          setEditedValues(response.data.properties_values || {});

          // Stop polling when no longer processing
          if (response.data.status !== "Processing") {
            clearInterval(interval);
          }
        }
      } catch {
        // Silently fail polling — will retry
      }
    }, EXTRACTION_POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [document?.status, documentId, get]);

  // ── Save handler ─────────────────────────────
  const handleSave = async () => {
    if (!document) return;

    setSaving(true);
    try {
      const updateData: UpdateDocumentRequest = {
        properties_values: editedValues,
      };

      const response = await put<ApiResponse<DocType>>(
        `/api/v1/documents/${documentId}`,
        updateData
      );
      if (response.data) {
        setDocument(response.data);
        setEditedValues(response.data.properties_values || {});
      }
      setIsEditing(false);
      toast({
        title: "Properties Saved",
        description: "Document properties have been updated successfully.",
      });
    } catch (err) {
      const apiError = err as ApiError;
      toast({
        title: "Error",
        description: apiError.message || "Failed to save document properties",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (document) {
      setEditedValues(document.properties_values || {});
    }
    setIsEditing(false);
  };

  const handlePropertyChange = (property: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [property]: value }));
  };

  const handleReplaceFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !document) return;

    setSaving(true);
    try {
      await post(`/api/v1/documents/${documentId}/replace`, {
        file_name: file.name,
      });

      toast({
        title: "File Uploaded",
        description: `${file.name} will be processed and parsed.`,
      });

      // Refresh document data
      await fetchDocument();
    } catch (err) {
      const apiError = err as ApiError;
      toast({
        title: "Error",
        description: apiError.message || "Failed to replace document",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Loading state ────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading document…</p>
        </div>
      </div>
    );
  }

  // ── Error / Not found ────────────────────────
  if (error || !document) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {error || "Document Not Found"}
          </h1>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const eventId = document.event_id || document.event?.id;
  const documentType = document.document_type;
  const properties = documentType?.properties || [];
  const isPdf = document.file_format === "PDF";
  const isProcessing = document.status === "Processing";

  return (
    <div className="h-[calc(100vh-3rem)] flex flex-col bg-background">
      {/* ── Header ── */}
      <div className="border-b border-border bg-card shrink-0">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() =>
                navigate(eventId ? `/event/${eventId}` : "/dashboard")
              }
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {documentType?.name || "Document"}
              </h1>
              <div className="flex items-center gap-3 mt-0.5">
                <p className="text-sm text-muted-foreground">
                  {document.file_name}
                </p>
                <StatusBadge status={document.status} />
                {isProcessing && (
                  <span className="inline-flex items-center gap-1 text-xs text-processing animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Extracting data…
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
              disabled={saving}
            >
              <Upload className="w-4 h-4" />
              Replace
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchDocument()}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleReplaceFile}
          accept=".pdf,.doc,.docx,.txt,.xlsx,.csv"
        />
      </div>

      {/* ── Main content: split view ── */}
      {isPdf ? (
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Left panel: PDF viewer */}
          <ResizablePanel defaultSize={55} minSize={30}>
            {pdfLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Loading PDF…
                  </p>
                </div>
              </div>
            ) : (
              <PdfViewer
                url={pdfUrl}
                title={document.file_name}
                isProcessing={isProcessing}
              />
            )}
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right panel: Document info + properties */}
          <ResizablePanel defaultSize={45} minSize={25}>
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                <DocumentInfoCard document={document} documentType={documentType} />
                <PropertiesCard
                  properties={properties}
                  documentType={documentType}
                  editedValues={editedValues}
                  isEditing={isEditing}
                  saving={saving}
                  isProcessing={isProcessing}
                  onEdit={() => setIsEditing(true)}
                  onCancel={handleCancel}
                  onSave={handleSave}
                  onPropertyChange={handlePropertyChange}
                />
              </div>
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        /* Non-PDF: single-column layout */
        <ScrollArea className="flex-1">
          <div className="container mx-auto px-6 py-8 space-y-8 max-w-4xl">
            <DocumentInfoCard document={document} documentType={documentType} />
            <PropertiesCard
              properties={properties}
              documentType={documentType}
              editedValues={editedValues}
              isEditing={isEditing}
              saving={saving}
              isProcessing={isProcessing}
              onEdit={() => setIsEditing(true)}
              onCancel={handleCancel}
              onSave={handleSave}
              onPropertyChange={handlePropertyChange}
            />
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

/* ──────────────────────────────────────────────
   Sub-components (co-located for readability)
   ────────────────────────────────────────────── */

interface DocumentInfoCardProps {
  document: DocType;
  documentType: DocType["document_type"];
}

function DocumentInfoCard({ document, documentType }: DocumentInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="w-5 h-5" />
          Document Information
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            File Name
          </Label>
          <p className="text-sm mt-1">{document.file_name}</p>
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Document Type
          </Label>
          <p className="text-sm mt-1">{documentType?.name || "Unknown"}</p>
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Format
          </Label>
          <p className="text-sm mt-1">{document.file_format}</p>
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Status
          </Label>
          <div className="mt-1">
            <StatusBadge status={document.status} />
          </div>
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Event
          </Label>
          <p className="text-sm mt-1">
            {document.event?.name || "Unknown"}
          </p>
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Project
          </Label>
          <p className="text-sm mt-1">
            {document.event?.project?.name || "Unknown"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface PropertiesCardProps {
  properties: { name: string; type: string }[];
  documentType: DocType["document_type"];
  editedValues: Record<string, string | number | boolean | null>;
  isEditing: boolean;
  saving: boolean;
  isProcessing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onPropertyChange: (property: string, value: string) => void;
}

function PropertiesCard({
  properties,
  documentType,
  editedValues,
  isEditing,
  saving,
  isProcessing,
  onEdit,
  onCancel,
  onSave,
  onPropertyChange,
}: PropertiesCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Parsed Document Properties</CardTitle>
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={onSave}
                className="gap-2"
                disabled={saving}
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                <Save className="w-4 h-4" />
                Save
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="gap-2"
              disabled={isProcessing}
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {isProcessing
            ? "Properties will appear here once extraction is complete."
            : "Property values extracted from the document."}
        </p>
      </CardHeader>
      <CardContent>
        {isProcessing && (
          <div className="flex items-center justify-center py-10 mb-4 border border-dashed border-border rounded-lg bg-muted/30">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-processing" />
              <p className="text-sm text-muted-foreground">
                AI is extracting data from your document…
              </p>
              <p className="text-xs text-muted-foreground/60">
                This typically takes 30–90 seconds
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {properties.map((property) => (
            <div
              key={property.name}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center p-3 border border-border rounded-lg"
            >
              <div>
                <Label className="font-medium text-sm">{property.name}</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {property.type} • {documentType?.name || "Document"}
                </p>
              </div>
              <div className="sm:col-span-2">
                {isEditing ? (
                  <Input
                    value={editedValues[property.name]?.toString() || ""}
                    onChange={(e) =>
                      onPropertyChange(property.name, e.target.value)
                    }
                    placeholder={`Enter ${property.name}`}
                    disabled={saving}
                  />
                ) : (
                  <div className="p-2 bg-muted rounded-md text-sm">
                    {editedValues[property.name] !== undefined &&
                    editedValues[property.name] !== null ? (
                      String(editedValues[property.name])
                    ) : (
                      <span className="text-muted-foreground italic">
                        {isProcessing ? "Pending…" : "No value extracted"}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {properties.length === 0 && !isProcessing && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No properties defined for this document type.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DocumentDetail;
