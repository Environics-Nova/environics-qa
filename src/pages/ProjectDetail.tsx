import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { StatusBadge } from "../components/StatusBadge";
import { EditProjectDialog } from "../components/EditProjectDialog";
import { sampleProjects, getProjectEvents } from "../data/sampleData";
import { ArrowLeft, Plus, Calendar, MapPin, User, Clock } from "lucide-react";
import { Event, Project } from "../types";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [currentProject, setCurrentProject] = useState<Project | undefined>(
    sampleProjects.find(p => p.project_id === projectId)
  );
  const events = projectId ? getProjectEvents(projectId) : [];

  const handleProjectUpdate = (updatedProject: Project) => {
    setCurrentProject(updatedProject);
  };

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  const formatEventTypes = (eventTypes: string[]) => {
    return eventTypes.join(", ");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{currentProject.name}</h1>
                <p className="text-muted-foreground mt-1">Project Details & Events</p>
              </div>
            </div>
            <div className="flex gap-2">
              <EditProjectDialog 
                project={currentProject} 
                onSave={handleProjectUpdate}
              />
              <Button onClick={() => navigate(`/project/${projectId}/event/new`)} className="gap-2">
                <Plus className="w-4 h-4" />
                New Event
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Project Details */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">Project Information</CardTitle>
              <StatusBadge status={currentProject.status} />
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <User className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">Client</p>
                  <p className="text-muted-foreground">{currentProject.client}</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">{currentProject.location}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">Start Date</p>
                  <p className="text-muted-foreground">{new Date(currentProject.start_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">End Date</p>
                  <p className="text-muted-foreground">{currentProject.end_date ? new Date(currentProject.end_date).toLocaleDateString() : "Ongoing"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Project Events</CardTitle>
              <Button onClick={() => navigate(`/project/${projectId}/event/new`)} variant="outline" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No events scheduled for this project.</p>
                <Button 
                  onClick={() => navigate(`/project/${projectId}/event/new`)} 
                  className="mt-4 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Schedule First Event
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div 
                    key={event.event_id}
                    className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleEventClick(event.event_id)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{event.name}</h3>
                        <div className="flex items-center gap-2">
                          {event.event_types.map((type, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-accent text-accent-foreground"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event.event_id);
                      }}>
                        View Details
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        Start: {new Date(event.start_datetime).toLocaleString()}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        End: {new Date(event.end_datetime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetail;