import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Loader2, AlertCircle, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useApiClient, ApiError } from "@/hooks/use-api-client";
import { Questionnaire, ApiResponse, CreateQuestionnaireRequest } from "@/types";
import { NewQuestionnaireDialog } from "@/components/NewQuestionnaireDialog";
import { useToast } from "@/hooks/use-toast";

const Questionnaires = () => {
  const { get, post, isLoaded, hasOrganization } = useApiClient();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      if (!isLoaded) return;

      if (!hasOrganization) {
        setLoading(false);
        setError("Please select an organization to view questionnaires.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await get<ApiResponse<{ questionnaires: Questionnaire[] }>>("/api/v1/questionnaires");
        const list = response.data?.questionnaires;
        setQuestionnaires(Array.isArray(list) ? list : []);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || "Failed to load questionnaires");
        setQuestionnaires([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaires();
  }, [get, isLoaded, hasOrganization]);

  const handleCreate = async (data: CreateQuestionnaireRequest) => {
    try {
      const response = await post<ApiResponse<Questionnaire>>("/api/v1/questionnaires", data);
      if (response.data) {
        toast({ title: "Questionnaire created", description: `"${response.data.name}" was created successfully.` });
        navigate(`/questionnaires/${response.data.id}`);
      }
    } catch (err) {
      const apiError = err as ApiError;
      toast({ title: "Error", description: apiError.message || "Failed to create questionnaire", variant: "destructive" });
      throw err;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Questionnaires</h1>
            <p className="text-muted-foreground">
              Create and manage questionnaires for your environmental assessment projects.
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Questionnaire
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {questionnaires.map((questionnaire) => (
              <Link
                key={questionnaire.id}
                to={`/questionnaires/${questionnaire.id}`}
                className="block hover:shadow-lg transition-shadow"
              >
                <Card className="h-full hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <FileText className="h-5 w-5 text-primary" />
                      <div className="flex gap-2">
                        {questionnaire.event_type && (
                          <Badge variant="outline" className="text-xs">
                            {questionnaire.event_type}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {questionnaire.question_count || questionnaire.questions?.length || 0} questions
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{questionnaire.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {questionnaire.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      {questionnaire.question_count || questionnaire.questions?.length || 0} questions configured
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && questionnaires.length === 0 && hasOrganization && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No questionnaires yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first questionnaire to get started with quality assurance.
            </p>
            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              New Questionnaire
            </Button>
          </div>
        )}
      </div>

      <NewQuestionnaireDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={handleCreate}
      />
    </div>
  );
};

export default Questionnaires;
