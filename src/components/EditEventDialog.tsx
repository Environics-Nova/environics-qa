import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Event, EventType } from "../types";
import { Edit } from "lucide-react";

interface EditEventDialogProps {
  event: Event;
  onSave: (updatedEvent: Event) => void;
}

export const EditEventDialog = ({ event, onSave }: EditEventDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Event>(event);

  const handleSave = () => {
    onSave(formData);
    setIsOpen(false);
  };

  const eventTypeOptions: EventType[] = ["PVV", "GWMS", "Drilling", "SV_Sampling", "Excavation", "Survey"];

  const handleEventTypeChange = (eventType: EventType, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        event_types: [...formData.event_types, eventType]
      });
    } else {
      setFormData({
        ...formData,
        event_types: formData.event_types.filter(type => type !== eventType)
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="w-4 h-4" />
          Edit Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="eventName">Event Name</Label>
            <Input
              id="eventName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter event name"
            />
          </div>
          
          <div className="space-y-3">
            <Label>Event Types</Label>
            <div className="grid grid-cols-2 gap-3">
              {eventTypeOptions.map((eventType) => (
                <div key={eventType} className="flex items-center space-x-2">
                  <Checkbox
                    id={eventType}
                    checked={formData.event_types.includes(eventType)}
                    onCheckedChange={(checked) => handleEventTypeChange(eventType, checked as boolean)}
                  />
                  <Label htmlFor={eventType} className="text-sm font-normal">
                    {eventType}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDateTime">Start Date & Time</Label>
              <Input
                id="startDateTime"
                type="datetime-local"
                value={formData.start_datetime.slice(0, 16)}
                onChange={(e) => setFormData({ ...formData, start_datetime: e.target.value + ":00" })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDateTime">End Date & Time</Label>
              <Input
                id="endDateTime"
                type="datetime-local"
                value={formData.end_datetime.slice(0, 16)}
                onChange={(e) => setFormData({ ...formData, end_datetime: e.target.value + ":00" })}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};