import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isLoaded, isSignedIn } = useAuth();

  // Show loading spinner while auth is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect authenticated users away from auth pages
  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  // Render children for unauthenticated users
  return <>{children}</>;
};

export default PublicRoute;
