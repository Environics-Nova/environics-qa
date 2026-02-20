import { useState, useEffect, useCallback } from "react";
import { Plus, FileText, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useApiClient, ApiError } from "@/hooks/use-api-client";
import { DocumentType, ApiResponse, CreateDocumentTypeRequest } from "@/types";
import { NewDocumentTypeDialog } from "@/components/NewDocumentTypeDialog";
import { useToast } from "@/hooks/use-toast";

const DocumentTypes = () => {
  const { get, post, isLoaded, hasOrganization } = useApiClient();
  const { toast } = useToast();
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchDocumentTypes = useCallback(async () => {
    if (!isLoaded) return;

    if (!hasOrganization) {
      setLoading(false);
      setError("Please select an organization to view document types.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await get<ApiResponse<Record<string, unknown>>>("/api/v1/document-types");
      const list = response.data?.document_types || response.data;
      setDocumentTypes(Array.isArray(list) ? list as DocumentType[] : []);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to load document types");
      setDocumentTypes([]);
    } finally {
      setLoading(false);
    }
  }, [get, isLoaded, hasOrganization]);

  useEffect(() => {
    fetchDocumentTypes();
  }, [fetchDocumentTypes]);

  const handleCreate = async (data: CreateDocumentTypeRequest) => {
    try {
      const response = await post<ApiResponse<DocumentType>>("/api/v1/document-types", data);
      if (response.data) {
        toast({ title: "Document Type created", description: `"${response.data.name}" was created successfully.` });
        await fetchDocumentTypes();
      }
    } catch (err) {
      const apiError = err as ApiError;
      toast({ title: "Error", description: apiError.message || "Failed to create document type", variant: "destructive" });
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Types</h1>
          <p className="text-muted-foreground mt-1">
            Manage your document types and predefined extraction properties.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2" disabled={!hasOrganization}>
          <Plus className="h-4 w-4" />
          New Document Type
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : documentTypes.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Document Types</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            You haven't defined any document types yet. Create your first document type with its predefined properties to start extracting data.
          </p>
          <Button onClick={() => setCreateOpen(true)} disabled={!hasOrganization}>
            Create your first Document Type
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentTypes.map((dt) => (
            <Card key={dt.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-start gap-4">
                  <span className="truncate" title={dt.name}>{dt.name}</span>
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  Created {new Date(dt.created_at || "").toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm border rounded-md p-3 bg-muted/30 h-[100px] overflow-y-auto">
                    <p className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-wider">Predefined Properties:</p>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(dt.properties) && dt.properties.length > 0 ? (
                        dt.properties.map((p, i) => {
                          const propName = typeof p === 'string' ? p : p.name;
                          const propType = typeof p === 'string' ? 'string' : p.type;
                          return (
                            <Badge key={i} variant="outline" className="bg-background flex gap-1 items-center">
                              <span className="font-medium">{propName}</span>
                              {propType && (
                                <span className="text-[10px] text-muted-foreground uppercase">
                                  {propType}
                                </span>
                              )}
                            </Badge>
                          );
                        })
                      ) : (
                        <span className="text-muted-foreground text-sm italic">No properties defined</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <NewDocumentTypeDialog 
        open={createOpen} 
        onOpenChange={setCreateOpen} 
        onSave={handleCreate} 
      />
    </div>
  );
};

export default DocumentTypes;
