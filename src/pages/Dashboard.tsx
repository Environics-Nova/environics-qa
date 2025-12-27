import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ProjectCard } from "../components/ProjectCard";
import { Plus, Search, Filter, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApiClient, ApiError } from "../hooks/use-api-client";
import { Project, ApiResponse, PaginatedResponse } from "../types";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

const Dashboard = () => {
  const navigate = useNavigate();
  const { get, isLoaded, isSignedIn, hasOrganization } = useApiClient();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      if (!isLoaded || !isSignedIn) return;
      
      if (!hasOrganization) {
        setLoading(false);
        setError("Please select an organization to view projects. Use the organization switcher in the sidebar.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Build query params
        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);
        if (yearFilter && yearFilter !== "all") params.append("year", yearFilter);
        
        const queryString = params.toString();
        const endpoint = `/api/v1/projects${queryString ? `?${queryString}` : ""}`;
        
        const response = await get<PaginatedResponse<Project>>(endpoint);
        setProjects(response.data || []);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || "Failed to load projects");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [get, isLoaded, isSignedIn, hasOrganization, searchTerm, yearFilter]);

  // Get available years from projects for filter
  const availableYears = Array.from(new Set(
    projects.map(p => new Date(p.start_date).getFullYear().toString())
  )).sort();

  const handleViewProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Environics</h1>
              <p className="text-muted-foreground mt-1">Environmental Site Assessment QA/QC Management</p>
            </div>
            <Button onClick={() => navigate("/project/new")} className="gap-2" disabled={!hasOrganization}>
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search projects or clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    disabled={!hasOrganization}
                  />
                </div>
              </div>
              <Select value={yearFilter} onValueChange={setYearFilter} disabled={!hasOrganization}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onView={handleViewProject}
              />
            ))}
          </div>
        )}

        {!loading && !error && projects.length === 0 && hasOrganization && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No projects found matching your criteria.</p>
            <Button 
              onClick={() => navigate("/project/new")} 
              className="mt-4 gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Your First Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;