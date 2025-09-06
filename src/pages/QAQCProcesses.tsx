import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, CheckCircle, XCircle } from "lucide-react";
import { sampleQAQCProcesses } from "@/data/sampleData";
import NewQAQCProcessDialog from "@/components/NewQAQCProcessDialog";
import { format } from "date-fns";

const QAQCProcesses = () => {
  const [isNewProcessDialogOpen, setIsNewProcessDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleProcessClick = (processId: string) => {
    navigate(`/qaqc-processes/${processId}`);
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
            <Button onClick={() => setIsNewProcessDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Process
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4">
          {sampleQAQCProcesses.map((process) => (
            <Card 
              key={process.process_id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleProcessClick(process.process_id)}
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
                      <span>Event: {process.event.name}</span>
                      <span>Questionnaire: {process.questionnaire.name}</span>
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

        <NewQAQCProcessDialog 
          open={isNewProcessDialogOpen}
          onOpenChange={setIsNewProcessDialogOpen}
        />
      </div>
    </div>
  );
};

export default QAQCProcesses;