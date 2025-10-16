import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { StatusBadge } from "./StatusBadge";
import { Project } from "../types";
import { MapPin, Calendar, User } from "lucide-react";
import { Button } from "./ui/button";

interface ProjectCardProps {
  project: Project;
  onView: (projectId: string) => void;
}

export const ProjectCard = ({ project, onView }: ProjectCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onView(project.project_id)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-foreground">{project.name}</CardTitle>
          <StatusBadge status={project.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="w-4 h-4 mr-2" />
          {project.client}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2" />
          {project.location}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(project.start_date).toLocaleDateString()} - {project.end_date ? new Date(project.end_date).toLocaleDateString() : "Ongoing"}
        </div>
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onView(project.project_id);
            }}
            className="w-full"
          >
            View Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};