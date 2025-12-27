import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useApiClient, ApiError } from "@/hooks/use-api-client";
import { QAQCProcess, Questionnaire, Event, ApiResponse, CreateQAQCProcessRequest } from "@/types";

interface NewQAQCProcessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProcessCreated?: (process: QAQCProcess) => void;
}

const NewQAQCProcessDialog = ({ open, onOpenChange, onProcessCreated }: NewQAQCProcessDialogProps) => {
  const { get, post, hasOrganization } = useApiClient();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch questionnaires and events when dialog opens
  useEffect(() => {
    const fetchData = async () => {
      if (!open || !hasOrganization) return;
      
      setLoading(true);
      try {
        // Fetch questionnaires
        const questionnairesResponse = await get<ApiResponse<Questionnaire[]>>("/api/v1/questionnaires");
        setQuestionnaires(questionnairesResponse.data || []);

        // Fetch all events (we'll filter them based on questionnaire selection)
        // Note: In a real app, you might want to fetch events differently
        const projectsResponse = await get<ApiResponse<{ id: string }[]>>("/api/v1/projects");
        const allEvents: Event[] = [];
        
        for (const project of (projectsResponse.data || [])) {
          const eventsResponse = await get<ApiResponse<Event[]>>(`/api/v1/projects/${project.id}/events`);
          allEvents.push(...(eventsResponse.data || []));
        }
        
        setEvents(allEvents);
      } catch (err) {
        const apiError = err as ApiError;
        toast.error(apiError.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, get, hasOrganization]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !selectedQuestionnaireId || !selectedEventId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const requestData: CreateQAQCProcessRequest = {
        name,
        description: description || undefined,
        questionnaire_id: selectedQuestionnaireId,
        event_id: selectedEventId,
      };

      const response = await post<ApiResponse<QAQCProcess>>("/api/v1/qaqc-processes", requestData);
      
      if (response.data) {
        toast.success("QA/QC Process initiated successfully");
        onProcessCreated?.(response.data);
        
        // Reset form
        setName("");
        setDescription("");
        setSelectedQuestionnaireId("");
        setSelectedEventId("");
        onOpenChange(false);
      }
    } catch (err) {
      const apiError = err as ApiError;
      toast.error(apiError.message || "Failed to create QA/QC process");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    setSelectedQuestionnaireId("");
    setSelectedEventId("");
    onOpenChange(false);
  };

  const selectedQuestionnaire = questionnaires.find(q => q.id === selectedQuestionnaireId);
  const filteredEvents = selectedQuestionnaire?.event_type 
    ? events.filter(event => event.event_types.includes(selectedQuestionnaire.event_type!))
    : events;

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
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Process Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter process name"
                  required
                  disabled={submitting}
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
                  disabled={submitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="questionnaire">Questionnaire *</Label>
                <Select 
                  value={selectedQuestionnaireId} 
                  onValueChange={setSelectedQuestionnaireId}
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a questionnaire" />
                  </SelectTrigger>
                  <SelectContent>
                    {questionnaires.map((questionnaire) => (
                      <SelectItem key={questionnaire.id} value={questionnaire.id}>
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
                  disabled={!selectedQuestionnaireId || submitting}
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
                      <SelectItem key={event.id} value={event.id}>
                        <div className="flex flex-col">
                          <span>{event.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {event.project?.name || "Project"} • Types: {event.event_types.join(", ")}
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
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Initiate Process
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewQAQCProcessDialog;
