import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Plus, Clock, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import NewQAQCProcessDialog from "@/components/NewQAQCProcessDialog";
import { format } from "date-fns";
import { useApiClient, ApiError } from "@/hooks/use-api-client";
import { QAQCProcess, ApiResponse, PaginatedResponse } from "@/types";

const QAQCProcesses = () => {
  const [isNewProcessDialogOpen, setIsNewProcessDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { get, isLoaded, hasOrganization } = useApiClient();
  
  const [processes, setProcesses] = useState<QAQCProcess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch QA/QC processes from API
  useEffect(() => {
    const fetchProcesses = async () => {
      if (!isLoaded) return;
      
      if (!hasOrganization) {
        setLoading(false);
        setError("Please select an organization to view QA/QC processes.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await get<PaginatedResponse<QAQCProcess>>("/api/v1/qaqc-processes");
        setProcesses(response.data || []);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || "Failed to load QA/QC processes");
        setProcesses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProcesses();
  }, [get, isLoaded, hasOrganization]);

  const handleProcessClick = (processId: string) => {
    navigate(`/qaqc-processes/${processId}`);
  };

  const handleProcessCreated = (newProcess: QAQCProcess) => {
    setProcesses(prev => [newProcess, ...prev]);
    setIsNewProcessDialogOpen(false);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">QA/QC Processes</h1>
              <p className="text-muted-foreground">
                Manage and monitor quality assurance and quality control processes for your environmental projects.
              </p>
            </div>
            <Button onClick={() => setIsNewProcessDialogOpen(true)} disabled={!hasOrganization}>
              <Plus className="h-4 w-4 mr-2" />
              New Process
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Processes List */}
        {!loading && !error && (
          <div className="grid gap-4">
            {processes.map((process) => (
              <Card 
                key={process.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleProcessClick(process.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{process.name}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {format(new Date(process.time), "MMM dd, yyyy 'at' HH:mm")}
                        </div>
                        <span>Event: {process.event?.name || "Unknown"}</span>
                        <span>Questionnaire: {process.questionnaire?.name || "Unknown"}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={process.result === "Passed" ? "default" : "destructive"}
                      className="flex items-center gap-1"
                    >
                      {process.result === "Passed" ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {process.result}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{process.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && !error && processes.length === 0 && hasOrganization && (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No QA/QC processes yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first QA/QC process to start validating your environmental data.
            </p>
            <Button onClick={() => setIsNewProcessDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Process
            </Button>
          </div>
        )}

        <NewQAQCProcessDialog 
          open={isNewProcessDialogOpen}
          onOpenChange={setIsNewProcessDialogOpen}
          onProcessCreated={handleProcessCreated}
        />
      </div>
    </div>
  );
};

export default QAQCProcesses;
