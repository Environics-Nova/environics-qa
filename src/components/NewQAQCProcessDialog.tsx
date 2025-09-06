import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sampleQuestionnaires, sampleEvents } from "@/data/sampleData";
import { toast } from "sonner";

interface NewQAQCProcessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewQAQCProcessDialog = ({ open, onOpenChange }: NewQAQCProcessDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !selectedQuestionnaireId || !selectedEventId) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedQuestionnaire = sampleQuestionnaires.find(q => q.questionnaire_id === selectedQuestionnaireId);
    const selectedEvent = sampleEvents.find(e => e.event_id === selectedEventId);

    if (!selectedQuestionnaire || !selectedEvent) {
      toast.error("Invalid questionnaire or event selection");
      return;
    }

    // Here you would typically create the new process
    toast.success("QA/QC Process initiated successfully");
    
    // Reset form
    setName("");
    setDescription("");
    setSelectedQuestionnaireId("");
    setSelectedEventId("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    setSelectedQuestionnaireId("");
    setSelectedEventId("");
    onOpenChange(false);
  };

  const selectedQuestionnaire = sampleQuestionnaires.find(q => q.questionnaire_id === selectedQuestionnaireId);
  const filteredEvents = selectedQuestionnaire?.event_type 
    ? sampleEvents.filter(event => event.event_types.includes(selectedQuestionnaire.event_type!))
    : sampleEvents;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New QA/QC Process</DialogTitle>
            <DialogDescription>
              Create a new quality assurance and quality control process by selecting a questionnaire and an event to apply it to.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Process Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter process name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter process description (optional)"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="questionnaire">Questionnaire *</Label>
              <Select value={selectedQuestionnaireId} onValueChange={setSelectedQuestionnaireId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a questionnaire" />
                </SelectTrigger>
                <SelectContent>
                  {sampleQuestionnaires.map((questionnaire) => (
                    <SelectItem key={questionnaire.questionnaire_id} value={questionnaire.questionnaire_id}>
                      <div className="flex flex-col">
                        <span>{questionnaire.name}</span>
                        {questionnaire.event_type && (
                          <span className="text-xs text-muted-foreground">
                            Event Type: {questionnaire.event_type}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event">Event *</Label>
              <Select 
                value={selectedEventId} 
                onValueChange={setSelectedEventId} 
                required
                disabled={!selectedQuestionnaireId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    selectedQuestionnaireId 
                      ? "Select an event" 
                      : "Select a questionnaire first"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {filteredEvents.map((event) => (
                    <SelectItem key={event.event_id} value={event.event_id}>
                      <div className="flex flex-col">
                        <span>{event.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {event.project.name} • Types: {event.event_types.join(", ")}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedQuestionnaire?.event_type && (
                <p className="text-xs text-muted-foreground">
                  Showing events with type: {selectedQuestionnaire.event_type}
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Initiate Process
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewQAQCProcessDialog;