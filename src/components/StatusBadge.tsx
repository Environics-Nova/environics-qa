import { Badge } from "./ui/badge";
import { ProjectStatus, DocumentStatus, QAQCResult } from "../types";

interface StatusBadgeProps {
  status: ProjectStatus | DocumentStatus | QAQCResult;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
      case "Parsed":
      case "Passed":
        return "default"; // Will use success colors
      case "In Progress":
      case "Processing":
        return "secondary";
      case "Not Started":
      case "Not Uploaded":
        return "outline";
      case "Cancelled":
      case "Failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Completed":
      case "Parsed":
      case "Passed":
        return "bg-success text-success-foreground hover:bg-success/90";
      case "In Progress":
        return "bg-primary text-primary-foreground hover:bg-primary/90";
      case "Processing":
        return "bg-processing text-processing-foreground hover:bg-processing/90";
      case "Not Started":
      case "Not Uploaded":
        return "bg-muted text-muted-foreground hover:bg-muted/90";
      case "Cancelled":
      case "Failed":
        return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
      default:
        return "";
    }
  };

  return (
    <Badge 
      variant={getStatusVariant(status)} 
      className={`${getStatusStyles(status)} ${className}`}
    >
      {status}
    </Badge>
  );
};