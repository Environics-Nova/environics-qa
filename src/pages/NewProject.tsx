import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import { ProjectStatus, CreateProjectRequest, Project, ApiResponse } from "../types";
import { useToast } from "../hooks/use-toast";
import { useApiClient, ApiError } from "../hooks/use-api-client";

const NewProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { post, hasOrganization, isLoaded } = useApiClient();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    location: "",
    status: "Not Started" as ProjectStatus,
    start_date: "",
    end_date: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.client || !formData.location || !formData.start_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!hasOrganization) {
      setError("Please select an organization before creating a project.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert date strings to ISO 8601 format for Go's time.Time
      const startDate = new Date(formData.start_date);
      const endDate = formData.end_date ? new Date(formData.end_date) : undefined;

      const requestData: CreateProjectRequest = {
        name: formData.name,
        client: formData.client,
        location: formData.location,
        status: formData.status,
        start_date: startDate.toISOString(),
        end_date: endDate?.toISOString(),
      };

      const response = await post<ApiResponse<Project>>("/api/v1/projects", requestData);
      
      if (response.data) {
        toast({
          title: "Project Created",
          description: `${formData.name} has been created successfully.`,
        });
        
        // Navigate to the new project
        navigate(`/project/${response.data.id}`);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to create project");
      toast({
        title: "Error",
        description: apiError.message || "Failed to create project",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Show organization required message
  if (isLoaded && !hasOrganization) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Create New Project</h1>
                <p className="text-muted-foreground mt-1">Add a new environmental site assessment project</p>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 py-8 max-w-2xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Organization Required</AlertTitle>
            <AlertDescription>
              Please select an organization using the organization switcher in the sidebar before creating a project.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create New Project</h1>
              <p className="text-muted-foreground mt-1">Add a new environmental site assessment project</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-2xl">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
            <p className="text-muted-foreground">
              Enter the basic information for your new environmental assessment project.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter project name"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) => handleInputChange("client", e.target.value)}
                  placeholder="Enter client name"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Enter project location"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Project Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleInputChange("status", value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange("start_date", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date (Optional)</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange("end_date", e.target.value)}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">Leave empty for ongoing projects</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/")} 
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 gap-2" disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Create Project
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewProject;
