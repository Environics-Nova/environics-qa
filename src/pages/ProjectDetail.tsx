import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { StatusBadge } from "../components/StatusBadge";
import { EditProjectDialog } from "../components/EditProjectDialog";
import { NewEventDialog } from "../components/NewEventDialog";
import { ArrowLeft, Plus, Calendar, MapPin, User, Clock, Loader2, AlertCircle } from "lucide-react";
import { Event, Project, ApiResponse } from "../types";
import { useApiClient, ApiError } from "../hooks/use-api-client";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { get, put, del, hasOrganization, isLoaded } = useApiClient();
  
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch project and events from API
  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !projectId) return;
      
      if (!hasOrganization) {
        setLoading(false);
        setError("Please select an organization to view project details.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch project details
        const projectResponse = await get<ApiResponse<Project>>(`/api/v1/projects/${projectId}`);
        if (projectResponse.data) {
          setCurrentProject(projectResponse.data);
        }

        // Fetch events for this project
        // API returns { data: { events: [...] } }
        const eventsResponse = await get<ApiResponse<{ events: Event[] }>>(`/api/v1/projects/${projectId}/events`);
        setEvents(eventsResponse.data?.events || []);
      } catch (err) {
        const apiError = err as ApiError;
        if (apiError.status === 404) {
          setError("Project not found");
        } else {
          setError(apiError.message || "Failed to load project");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [get, projectId, hasOrganization, isLoaded]);

  const handleProjectUpdate = async (updatedProject: Project) => {
    try {
      const response = await put<ApiResponse<Project>>(`/api/v1/projects/${projectId}`, {
        name: updatedProject.name,
        client: updatedProject.client,
        location: updatedProject.location,
        status: updatedProject.status,
        start_date: updatedProject.start_date,
        end_date: updatedProject.end_date,
      });
      if (response.data) {
        setCurrentProject(response.data);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to update project");
    }
  };

  const handleEventCreate = (newEvent: Event) => {
    setEvents([...events, newEvent]);
  };

  const handleDeleteProject = async () => {
    try {
      await del(`/api/v1/projects/${projectId}`);
      navigate("/dashboard");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to delete project");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error or not found state
  if (error || !currentProject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-4">{error || "Project Not Found"}</h1>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/dashboard")} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{currentProject.name}</h1>
                <p className="text-muted-foreground mt-1">Project Details & Events</p>
              </div>
            </div>
            <EditProjectDialog 
              project={currentProject} 
              onSave={handleProjectUpdate}
            />
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
              <NewEventDialog 
                project={currentProject}
                onSave={handleEventCreate}
                trigger={
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Event
                  </Button>
                }
              />
            </div>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No events scheduled for this project.</p>
                <NewEventDialog 
                  project={currentProject}
                  onSave={handleEventCreate}
                  trigger={
                    <Button className="mt-4 gap-2">
                      <Plus className="w-4 h-4" />
                      Schedule First Event
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div 
                    key={event.id}
                    className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleEventClick(event.id)}
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
                        handleEventClick(event.id);
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
