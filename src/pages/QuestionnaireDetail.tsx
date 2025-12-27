import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Edit, Plus, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Questionnaire, Question, DocumentType, ApiResponse, CreateQuestionRequest, UpdateQuestionRequest } from "@/types";
import { EditQuestionnaireDialog } from "@/components/EditQuestionnaireDialog";
import { EditQuestionDialog } from "@/components/EditQuestionDialog";
import { useApiClient, ApiError } from "@/hooks/use-api-client";
import { useToast } from "@/hooks/use-toast";

const QuestionnaireDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { get, put, post, del, isLoaded, hasOrganization } = useApiClient();
  const { toast } = useToast();
  
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editQuestionnaireOpen, setEditQuestionnaireOpen] = useState(false);
  const [editQuestionOpen, setEditQuestionOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [addQuestionOpen, setAddQuestionOpen] = useState(false);

  // Fetch questionnaire and document types from API
  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !id) return;
      
      if (!hasOrganization) {
        setLoading(false);
        setError("Please select an organization to view questionnaire details.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch questionnaire with questions
        const questionnaireResponse = await get<ApiResponse<Questionnaire>>(`/api/v1/questionnaires/${id}`);
        if (questionnaireResponse.data) {
          setQuestionnaire(questionnaireResponse.data);
        }

        // Fetch document types for question editing
        const docTypesResponse = await get<ApiResponse<DocumentType[]>>("/api/v1/document-types");
        setDocumentTypes(docTypesResponse.data || []);
      } catch (err) {
        const apiError = err as ApiError;
        if (apiError.status === 404) {
          setError("Questionnaire not found");
        } else {
          setError(apiError.message || "Failed to load questionnaire");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [get, id, isLoaded, hasOrganization]);

  const handleEditQuestionnaire = async (updatedQuestionnaire: Questionnaire) => {
    try {
      const response = await put<ApiResponse<Questionnaire>>(`/api/v1/questionnaires/${id}`, {
        name: updatedQuestionnaire.name,
        description: updatedQuestionnaire.description,
        event_type: updatedQuestionnaire.event_type,
      });
      if (response.data) {
        setQuestionnaire(prev => prev ? { ...prev, ...response.data } : response.data!);
      }
      toast({
        title: "Success",
        description: "Questionnaire updated successfully.",
      });
    } catch (err) {
      const apiError = err as ApiError;
      toast({
        title: "Error",
        description: apiError.message || "Failed to update questionnaire",
        variant: "destructive",
      });
    }
  };

  const handleEditQuestion = async (updatedQuestion: Question) => {
    if (!questionnaire) return;
    
    try {
      const updateData: UpdateQuestionRequest = {
        document_1_id: updatedQuestion.document_1_id,
        property_1: updatedQuestion.property_1,
        relation: updatedQuestion.relation,
        document_2_id: updatedQuestion.document_2_id,
        property_2: updatedQuestion.property_2,
        comparison_value: updatedQuestion.comparison_value,
        system_value: updatedQuestion.system_value,
      };

      const response = await put<ApiResponse<Question>>(`/api/v1/questions/${updatedQuestion.id}`, updateData);
      
      if (response.data) {
        const updatedQuestions = (questionnaire.questions || []).map(q => 
          q.id === updatedQuestion.id ? response.data! : q
        );
        
        setQuestionnaire({
          ...questionnaire,
          questions: updatedQuestions
        });
      }
      
      toast({
        title: "Success",
        description: "Question updated successfully.",
      });
    } catch (err) {
      const apiError = err as ApiError;
      toast({
        title: "Error",
        description: apiError.message || "Failed to update question",
        variant: "destructive",
      });
    }
  };

  const handleAddQuestion = async (newQuestion: Question) => {
    if (!questionnaire) return;
    
    try {
      const createData: CreateQuestionRequest = {
        document_1_id: newQuestion.document_1_id,
        property_1: newQuestion.property_1,
        relation: newQuestion.relation,
        document_2_id: newQuestion.document_2_id,
        property_2: newQuestion.property_2,
        comparison_value: newQuestion.comparison_value,
        system_value: newQuestion.system_value,
      };

      const response = await post<ApiResponse<Question>>(`/api/v1/questionnaires/${id}/questions`, createData);
      
      if (response.data) {
        setQuestionnaire({
          ...questionnaire,
          questions: [...(questionnaire.questions || []), response.data]
        });
      }
      
      toast({
        title: "Success",
        description: "Question added successfully.",
      });
    } catch (err) {
      const apiError = err as ApiError;
      toast({
        title: "Error",
        description: apiError.message || "Failed to add question",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!questionnaire) return;
    
    try {
      await del(`/api/v1/questions/${questionId}`);
      
      setQuestionnaire({
        ...questionnaire,
        questions: (questionnaire.questions || []).filter(q => q.id !== questionId)
      });
      
      toast({
        title: "Success",
        description: "Question deleted successfully.",
      });
    } catch (err) {
      const apiError = err as ApiError;
      toast({
        title: "Error",
        description: apiError.message || "Failed to delete question",
        variant: "destructive",
      });
    }
  };

  const openEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setEditQuestionOpen(true);
  };

  const openAddQuestion = () => {
    setSelectedQuestion(null);
    setAddQuestionOpen(true);
  };

  // Get document type name by ID
  const getDocumentTypeName = (docTypeId: string): string => {
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
  if (error || !questionnaire) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || "Questionnaire not found"}</AlertDescription>
          </Alert>
          <Link to="/questionnaires" className="inline-flex items-center text-muted-foreground hover:text-foreground mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questionnaires
          </Link>
        </div>
      </div>
    );
  }

  const questions = questionnaire.questions || [];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link to="/questionnaires" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questionnaires
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{questionnaire.name}</h1>
              <p className="text-muted-foreground mb-4">{questionnaire.description}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setEditQuestionnaireOpen(true)}
              className="flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Questionnaire
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Questionnaire Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-foreground">{questionnaire.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Event Type</p>
                  <p className="text-foreground">{questionnaire.event_type || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
                  <p className="text-foreground">{questions.length}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-foreground">{questionnaire.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Questions</CardTitle>
                <CardDescription>
                  Manage the questions for this questionnaire
                </CardDescription>
              </div>
              <Button onClick={openAddQuestion} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document 1 & Property</TableHead>
                    <TableHead>Relation</TableHead>
                    <TableHead>Document 2/Property OR Fixed Value</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{question.document_1?.name || getDocumentTypeName(question.document_1_id)}</p>
                          <p className="text-sm text-muted-foreground">{question.property_1}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          {question.relation}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {question.document_2_id ? (
                            <>
                              <p className="font-medium">{question.document_2?.name || getDocumentTypeName(question.document_2_id)}</p>
                              <p className="text-sm text-muted-foreground">{question.property_2}</p>
                            </>
                          ) : (
                            <p className="font-medium text-primary">Fixed Value: {question.comparison_value}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditQuestion(question)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {questions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No questions configured yet.</p>
                  <Button onClick={openAddQuestion} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Question
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <EditQuestionnaireDialog
          questionnaire={questionnaire}
          open={editQuestionnaireOpen}
          onOpenChange={setEditQuestionnaireOpen}
          onSave={handleEditQuestionnaire}
        />

        <EditQuestionDialog
          question={selectedQuestion}
          questionnaire={questionnaire}
          documentTypes={documentTypes}
          open={editQuestionOpen || addQuestionOpen}
          onOpenChange={(open) => {
            setEditQuestionOpen(open);
            setAddQuestionOpen(open);
            if (!open) setSelectedQuestion(null);
          }}
          onSave={selectedQuestion ? handleEditQuestion : handleAddQuestion}
        />
      </div>
    </div>
  );
};

export default QuestionnaireDetail;
