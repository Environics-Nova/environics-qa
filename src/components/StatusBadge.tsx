import { Badge } from "./ui/badge";
import { Clock } from "lucide-react";
import { ProjectStatus, DocumentStatus, QAQCResult } from "../types";

interface StatusBadgeProps {
  status: ProjectStatus | DocumentStatus | QAQCResult;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Completed":
      case "Parsed":
      case "Passed":
        return "bg-emerald-500/15 text-emerald-700 border-emerald-300 dark:text-emerald-400 dark:border-emerald-700";
      case "In Progress":
        return "bg-blue-500/15 text-blue-700 border-blue-300 dark:text-blue-400 dark:border-blue-700";
      case "Processing":
        return "bg-indigo-500/15 text-indigo-700 border-indigo-300 dark:text-indigo-400 dark:border-indigo-700";
      case "Pending":
        return "bg-amber-500/15 text-amber-700 border-amber-300 dark:text-amber-400 dark:border-amber-700";
      case "Not Started":
      case "Not Uploaded":
        return "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
      case "Extraction Failed":
        return "bg-orange-500/15 text-orange-700 border-orange-300 dark:text-orange-400 dark:border-orange-700";
      case "Cancelled":
      case "Failed":
        return "bg-red-500/15 text-red-700 border-red-300 dark:text-red-400 dark:border-red-700";
      default:
        return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  const isPending = status === "Pending" || status === "Processing";

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1 font-medium ${getStatusStyles(status)} ${className ?? ""}`}
    >
      {isPending && (
        <Clock className="h-3 w-3 animate-pulse" />
      )}
      {status}
    </Badge>
  );
};