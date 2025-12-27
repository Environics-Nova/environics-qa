import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Project, Event, EventType, ApiResponse, CreateEventRequest } from "../types";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "./ui/use-toast";
import { useApiClient, ApiError } from "../hooks/use-api-client";

interface NewEventDialogProps {
  project: Project;
  onSave: (event: Event) => void;
  trigger?: React.ReactNode;
}

const eventTypeOptions: EventType[] = ["Drilling", "GWMS", "SV_Sampling", "PVV", "Survey", "Excavation"];

export const NewEventDialog = ({ project, onSave, trigger }: NewEventDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { post } = useApiClient();
  const [formData, setFormData] = useState({
    name: "",
    start_datetime: "",
    end_datetime: "",
    event_types: [] as EventType[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.start_datetime || !formData.end_datetime || formData.event_types.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields and select at least one event type.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const requestData: CreateEventRequest = {
        name: formData.name,
        start_datetime: new Date(formData.start_datetime).toISOString(),
        end_datetime: new Date(formData.end_datetime).toISOString(),
        event_types: formData.event_types
      };

      const response = await post<ApiResponse<Event>>(
        `/api/v1/projects/${project.id}/events`,
        requestData
      );

      if (response.data) {
        onSave(response.data);
        setOpen(false);
        setFormData({
          name: "",
          start_datetime: "",
          end_datetime: "",
          event_types: []
        });
        
        toast({
          title: "Success",
          description: "Event created successfully."
        });
      }
    } catch (err) {
      const apiError = err as ApiError;
      toast({
        title: "Error",
        description: apiError.message || "Failed to create event",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleEventType = (type: EventType) => {
    setFormData(prev => ({
      ...prev,
      event_types: prev.event_types.includes(type)
        ? prev.event_types.filter(t => t !== type)
        : [...prev.event_types, type]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Event
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter event name"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_datetime">Start Date & Time *</Label>
              <Input
                id="start_datetime"
                type="datetime-local"
                value={formData.start_datetime}
                onChange={(e) => setFormData({ ...formData, start_datetime: e.target.value })}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_datetime">End Date & Time *</Label>
              <Input
                id="end_datetime"
                type="datetime-local"
                value={formData.end_datetime}
                onChange={(e) => setFormData({ ...formData, end_datetime: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Event Types *</Label>
            <div className="grid grid-cols-3 gap-2">
              {eventTypeOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleEventType(type)}
                  disabled={loading}
                  className={`px-3 py-2 rounded-md text-sm font-medium border transition-colors ${
                    formData.event_types.includes(type)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-muted"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
