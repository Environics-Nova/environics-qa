import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useApiClient, ApiError } from "@/hooks/use-api-client";
import { QAQCProcess, ApiResponse, DocumentType } from "@/types";

const QAQCProcessDetail = () => {
  const { processId } = useParams<{ processId: string }>();
  const navigate = useNavigate();
  const { get, post, isLoaded, hasOrganization } = useApiClient();
  
  const [process, setProcess] = useState<QAQCProcess | null>(null);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [rerunning, setRerunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch QA/QC process from API
  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !processId) return;
      
      if (!hasOrganization) {
        setLoading(false);
        setError("Please select an organization to view process details.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch process with results
        const processResponse = await get<ApiResponse<QAQCProcess>>(`/api/v1/qaqc-processes/${processId}`);
        if (processResponse.data) {
          setProcess(processResponse.data);
        }

        // Fetch document types for displaying question details
        const docTypesResponse = await get<ApiResponse<DocumentType[]>>("/api/v1/document-types");
        setDocumentTypes(docTypesResponse.data || []);
      } catch (err) {
        const apiError = err as ApiError;
        if (apiError.status === 404) {
          setError("QA/QC process not found");
        } else {
          setError(apiError.message || "Failed to load process");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [get, processId, isLoaded, hasOrganization]);

  const handleReRun = async () => {
    if (!processId) return;
    
    setRerunning(true);
    try {
      const response = await post<ApiResponse<QAQCProcess>>(`/api/v1/qaqc-processes/${processId}/rerun`);
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

  // Get document type name by ID
  const getDocumentTypeName = (docTypeId?: string): string => {
    if (!docTypeId) return "Unknown";
    const docType = documentTypes.find(dt => dt.id === docTypeId);
    return docType?.name || "Unknown";
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error state
  if (error || !process) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || "Process not found"}</AlertDescription>
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

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate("/qaqc-processes")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Processes
          </Button>
          
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">{process.name}</h1>
              <p className="text-muted-foreground">{process.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Executed: {format(new Date(process.time), "MMM dd, yyyy 'at' HH:mm")}</span>
                <span>Event: {process.event?.name || "Unknown"}</span>
                <span>Questionnaire: {process.questionnaire?.name || "Unknown"}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge 
                variant={process.result === "Passed" ? "default" : "destructive"}
                className="flex items-center gap-1 text-sm px-3 py-1"
              >
                {process.result === "Passed" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {process.result}
              </Badge>
              <Button onClick={handleReRun} disabled={rerunning}>
                {rerunning ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Re-run Process
              </Button>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground mb-4">Question Results</h2>
          
          {results.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No results available for this process.</p>
            </div>
          ) : (
            results.map((result, index) => {
              const question = result.question;
              const doc1Name = question?.document_1?.name || getDocumentTypeName(question?.document_1_id);
              const doc2Name = question?.document_2?.name || getDocumentTypeName(question?.document_2_id);
              
              return (
                <Card key={result.id || `${result.question_id}-${index}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        Question {index + 1}
                      </CardTitle>
                      <Badge 
                        variant={result.status === "Passed" ? "default" : "destructive"}
                        className="flex items-center gap-1"
                      >
                        {result.status === "Passed" ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {result.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-foreground font-medium">
                        <span className="text-primary">{question?.property_1 || "Property"}</span> in{" "}
                        <span className="text-primary">{doc1Name}</span>{" "}
                        <span className="text-muted-foreground">{question?.relation || "?"}</span>{" "}
                        <span className="text-primary">
                          {question?.document_2_id || question?.document_2
                            ? `${question?.property_2 || "Property"} in ${doc2Name}`
                            : question?.comparison_value || "Value"
                          }
                        </span>
                      </p>
                    </div>
                    
                    {result.status === "Failed" && result.comment && (
                      <div className="border-l-4 border-destructive pl-4">
                        <h4 className="font-medium text-foreground mb-1">Failure Comment:</h4>
                        <p className="text-muted-foreground">{result.comment}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default QAQCProcessDetail;
