import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Edit, Plus } from "lucide-react";
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
import { sampleQuestionnaires } from "@/data/sampleData";
import { Questionnaire, Question } from "@/types";
import { EditQuestionnaireDialog } from "@/components/EditQuestionnaireDialog";
import { EditQuestionDialog } from "@/components/EditQuestionDialog";

const QuestionnaireDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | undefined>(
    sampleQuestionnaires.find(q => q.questionnaire_id === id)
  );
  const [editQuestionnaireOpen, setEditQuestionnaireOpen] = useState(false);
  const [editQuestionOpen, setEditQuestionOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [addQuestionOpen, setAddQuestionOpen] = useState(false);

  if (!questionnaire) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-muted-foreground">Questionnaire not found</p>
        </div>
      </div>
    );
  }

  const handleEditQuestionnaire = (updatedQuestionnaire: Questionnaire) => {
    setQuestionnaire(updatedQuestionnaire);
  };

  const handleEditQuestion = (updatedQuestion: Question) => {
    if (!questionnaire) return;
    
    const updatedQuestions = questionnaire.questions.map(q => 
      q.question_id === updatedQuestion.question_id ? updatedQuestion : q
    );
    
    setQuestionnaire({
      ...questionnaire,
      questions: updatedQuestions
    });
  };

  const handleAddQuestion = (newQuestion: Question) => {
    if (!questionnaire) return;
    
    setQuestionnaire({
      ...questionnaire,
      questions: [...questionnaire.questions, newQuestion]
    });
  };

  const openEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setEditQuestionOpen(true);
  };

  const openAddQuestion = () => {
    setSelectedQuestion(null);
    setAddQuestionOpen(true);
  };

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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-foreground">{questionnaire.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
                  <p className="text-foreground">{questionnaire.questions.length}</p>
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
                    <TableHead>Document 2/Value & Property</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questionnaire.questions.map((question) => (
                    <TableRow key={question.question_id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{question.document_1.name}</p>
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
                          <p className="font-medium">{question.document_2.name}</p>
                          <p className="text-sm text-muted-foreground">{question.property_2}</p>
                          <p className="text-xs text-muted-foreground">Value: {question.comparison_value}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditQuestion(question)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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