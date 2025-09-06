import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sampleQuestionnaires } from "@/data/sampleData";

const Questionnaires = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Questionnaires</h1>
          <p className="text-muted-foreground">
            Create and manage questionnaires for your environmental assessment projects.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sampleQuestionnaires.map((questionnaire) => (
            <Link
              key={questionnaire.questionnaire_id}
              to={`/questionnaires/${questionnaire.questionnaire_id}`}
              className="block hover:shadow-lg transition-shadow"
            >
              <Card className="h-full hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <FileText className="h-5 w-5 text-primary" />
                    <Badge variant="secondary" className="text-xs">
                      {questionnaire.questions.length} questions
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{questionnaire.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {questionnaire.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {questionnaire.questions.length} questions configured
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {sampleQuestionnaires.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No questionnaires yet</h3>
            <p className="text-muted-foreground">
              Create your first questionnaire to get started with quality assurance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaires;