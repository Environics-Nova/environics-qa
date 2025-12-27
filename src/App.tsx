import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { AppSidebar } from "@/components/AppSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import Index from "./pages/Index";
import ProjectDetail from "./pages/ProjectDetail";
import EventDetail from "./pages/EventDetail";
import DocumentDetail from "./pages/DocumentDetail";
import NewProject from "./pages/NewProject";
import QAQCProcesses from "./pages/QAQCProcesses";
import QAQCProcessDetail from "./pages/QAQCProcessDetail";
import Questionnaires from "./pages/Questionnaires";
import QuestionnaireDetail from "./pages/QuestionnaireDetail";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout component for authenticated pages with sidebar
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <main className="flex-1 flex flex-col">
        <header className="h-12 flex items-center justify-between border-b bg-background px-2">
          <SidebarTrigger />
          <UserButton afterSignOutUrl="/sign-in" />
        </header>
        <div className="flex-1">{children}</div>
      </main>
    </div>
  </SidebarProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public auth routes */}
          <Route
            path="/sign-in/*"
            element={
              <PublicRoute>
                <SignInPage />
              </PublicRoute>
            }
          />
          <Route
            path="/sign-up/*"
            element={
              <PublicRoute>
                <SignUpPage />
              </PublicRoute>
            }
          />

          {/* Protected routes with authenticated layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Index />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/new"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <NewProject />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:projectId"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ProjectDetail />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/event/:eventId"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <EventDetail />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/document/:documentId"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <DocumentDetail />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/qaqc-processes"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <QAQCProcesses />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/qaqc-processes/:processId"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <QAQCProcessDetail />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/questionnaires"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Questionnaires />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/questionnaires/:id"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <QuestionnaireDetail />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
