import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { StatusBadge } from "../components/StatusBadge";
import { ArrowLeft, Save, Edit, FileText, Upload, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useApiClient, ApiError } from "../hooks/use-api-client";
import { Document, ApiResponse, UpdateDocumentRequest } from "../types";

const DocumentDetail = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { get, put, post, hasOrganization, isLoaded } = useApiClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, string | number | boolean | null>>({});

  // Fetch document from API
  useEffect(() => {
    const fetchDocument = async () => {
      if (!isLoaded || !documentId) return;
      
      if (!hasOrganization) {
        setLoading(false);
        setError("Please select an organization to view document details.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await get<ApiResponse<Document>>(`/api/v1/documents/${documentId}`);
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
    };

    fetchDocument();
  }, [get, documentId, hasOrganization, isLoaded]);

  const handleSave = async () => {
    if (!document) return;

    setSaving(true);
    try {
      const updateData: UpdateDocumentRequest = {
        properties_values: editedValues,
      };

      const response = await put<ApiResponse<Document>>(`/api/v1/documents/${documentId}`, updateData);
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
    setEditedValues(prev => ({
      ...prev,
      [property]: value
    }));
  };

  const handleReplaceFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !document) return;

    setSaving(true);
    try {
      // In a real implementation, this would upload the file
      // For now, we'll call the replace endpoint
      await post(`/api/v1/documents/${documentId}/replace`, {
        file_name: file.name,
      });
      
      toast({
        title: "File Uploaded",
        description: `${file.name} will be processed and parsed.`,
      });

      // Refresh document data
      const response = await get<ApiResponse<Document>>(`/api/v1/documents/${documentId}`);
      if (response.data) {
        setDocument(response.data);
        setEditedValues(response.data.properties_values || {});
      }
    } catch (err) {
      const apiError = err as ApiError;
      toast({
        title: "Error",
        description: apiError.message || "Failed to replace document",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error or not found state
  if (error || !document) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-4">{error || "Document Not Found"}</h1>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate(eventId ? `/event/${eventId}` : "/")} 
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Event
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{documentType?.name || "Document"}</h1>
                <p className="text-muted-foreground mt-1">{document.file_name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Document Information */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Document Information
              </CardTitle>
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
            </div>
          </CardHeader>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleReplaceFile}
            accept=".pdf,.doc,.docx,.txt,.xlsx,.csv"
          />
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">File Name</Label>
                <p className="text-muted-foreground">{document.file_name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Document Type</Label>
                <p className="text-muted-foreground">{documentType?.name || "Unknown"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">File Format</Label>
                <p className="text-muted-foreground">{document.file_format}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">
                  <StatusBadge status={document.status} />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Event</Label>
                <p className="text-muted-foreground">{document.event?.name || "Unknown"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Project</Label>
                <p className="text-muted-foreground">{document.event?.project?.name || "Unknown"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Properties */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Parsed Document Properties</CardTitle>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel} disabled={saving}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} className="gap-2" disabled={saving}>
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              )}
            </div>
            <p className="text-muted-foreground">
              Property values extracted from the document. Click edit to modify any values.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {properties.map((property) => (
                <div key={property} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 border border-border rounded-lg">
                  <div>
                    <Label className="font-medium">{property}</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Required property for {documentType?.name || "this document"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    {isEditing ? (
                      <Input
                        value={editedValues[property] || ""}
                        onChange={(e) => handlePropertyChange(property, e.target.value)}
                        placeholder={`Enter ${property}`}
                        disabled={saving}
                      />
                    ) : (
                      <div className="p-2 bg-muted rounded-md">
                        {editedValues[property] || (
                          <span className="text-muted-foreground italic">No value extracted</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {properties.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No properties defined for this document type.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentDetail;
