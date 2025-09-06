import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { sampleQAQCProcesses } from "@/data/sampleData";
import { format } from "date-fns";
import { toast } from "sonner";

const QAQCProcessDetail = () => {
  const { processId } = useParams<{ processId: string }>();
  const navigate = useNavigate();
  
  const process = sampleQAQCProcesses.find(p => p.process_id === processId);

  if (!process) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-2">Process Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested QA/QC process could not be found.</p>
            <Button onClick={() => navigate("/qaqc-processes")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Processes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleReRun = () => {
    toast.success("Process re-run initiated successfully");
  };

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
                <span>Event: {process.event.name}</span>
                <span>Questionnaire: {process.questionnaire.name}</span>
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
              <Button onClick={handleReRun}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Re-run Process
              </Button>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground mb-4">Question Results</h2>
          
          {process.results.map((result, index) => (
            <Card key={`${result.question.question_id}-${index}`}>
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
                    <span className="text-primary">{result.question.property_1}</span> in{" "}
                    <span className="text-primary">{result.question.document_1.name}</span>{" "}
                    <span className="text-muted-foreground">{result.question.relation}</span>{" "}
                    <span className="text-primary">
                      {result.question.document_2 
                        ? `${result.question.property_2} in ${result.question.document_2.name}`
                        : result.question.comparison_value
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default QAQCProcessDetail;