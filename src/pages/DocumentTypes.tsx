import { useState, useEffect, useCallback } from "react";
import { Loader2, AlertCircle, RefreshCw, PenSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useApiClient, ApiError } from "@/hooks/use-api-client";
import { DocumentType, ApiResponse, PropertyDef } from "@/types";
import { EditDocumentTypeDialog } from "@/components/EditDocumentTypeDialog";
import { useToast } from "@/hooks/use-toast";

// The fixed document types that MUST exist per organization
const FIXED_DOC_TYPES = [
  { name: "Survey Log", properties: [{ name: "Survey_Date", type: "date" }, { name: "Surveyor", type: "string" }, { name: "Coordinates", type: "string" }] },
  { name: "Soil Vapour Log", properties: [{ name: "Sample_ID", type: "string" }, { name: "Depth", type: "string" }, { name: "VOC_Concentration", type: "string" }] },
  { name: "Borehole Log", properties: [{ name: "Depth", type: "string" }, { name: "Soil_Type", type: "string" }, { name: "Moisture_Content", type: "string" }] },
  { name: "Daily field activity log", properties: [{ name: "Date", type: "date" }, { name: "Activity_Description", type: "string" }] },
  { name: "Confirmatory & interim Soil Samples", properties: [{ name: "Sample_ID", type: "string" }, { name: "Result", type: "string" }] },
  { name: "GWMS Logs", properties: [{ name: "Well_ID", type: "string" }, { name: "Water_Level", type: "string" }, { name: "pH", type: "string" }] },
];

const DocumentTypes = () => {
  const { get, post, put, isLoaded, hasOrganization } = useApiClient();
  const { toast } = useToast();
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Edit state
  const [editOpen, setEditOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType | null>(null);

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
      let list = (response.data?.document_types || response.data) as DocumentType[];
      if (!Array.isArray(list)) list = [];

      // Check if all FIXED doc types exist
      const existingNames = new Set(list.map(dt => dt.name));
      let missingTypes = FIXED_DOC_TYPES.filter(dt => !existingNames.has(dt.name));

      // Auto-create missing types
      if (missingTypes.length > 0) {
        for (const typeDef of missingTypes) {
          try {
            const createRes = await post<ApiResponse<DocumentType>>("/api/v1/document-types", {
              name: typeDef.name,
              properties: typeDef.properties,
            });
            if (createRes.data) {
              list.push(createRes.data);
            }
          } catch (createErr) {
            console.error("Failed to auto-create missing document type:", typeDef.name, createErr);
          }
        }
      }

      // We only care about showing the fixed ones (in case legacy ones were added earlier)
      const fixedSubset = list.filter(dt => FIXED_DOC_TYPES.some(fd => fd.name === dt.name));
      setDocumentTypes(fixedSubset);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to load document types");
      setDocumentTypes([]);
    } finally {
      setLoading(false);
    }
  }, [get, post, isLoaded, hasOrganization]);

  useEffect(() => {
    fetchDocumentTypes();
  }, [fetchDocumentTypes]);

  const handleEdit = (dt: DocumentType) => {
    setSelectedDocType(dt);
    setEditOpen(true);
  };

  const handleSaveEdit = async (id: string, properties: PropertyDef[]) => {
    try {
      const response = await put<ApiResponse<DocumentType>>(`/api/v1/document-types/${id}`, {
        properties: properties,
      });
      if (response.data) {
        toast({ title: "Document Type updated", description: `Fields were updated successfully.` });
        setDocumentTypes(prev => prev.map(dt => dt.id === id ? response.data! : dt));
      }
    } catch (err) {
      const apiError = err as ApiError;
      toast({ title: "Error", description: apiError.message || "Failed to update document type", variant: "destructive" });
      throw err;
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
            Audit and manage extraction fields for your fixed document types.
          </p>
        </div>
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentTypes.map((dt) => (
            <Card key={dt.id} className="hover:shadow-md transition-shadow relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(dt)} className="h-8 w-8 bg-background shadow-sm border">
                  <PenSquare className="h-4 w-4 text-primary" />
                </Button>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-start gap-4">
                  <span className="truncate" title={dt.name}>{dt.name}</span>
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  Fixed System Type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm border rounded-md p-3 bg-muted/30 h-[100px] overflow-y-auto">
                    <p className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-wider">Properties to Extract:</p>
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

      <EditDocumentTypeDialog 
        documentType={selectedDocType}
        open={editOpen} 
        onOpenChange={setEditOpen} 
        onSave={handleSaveEdit} 
      />
    </div>
  );
};

export default DocumentTypes;
