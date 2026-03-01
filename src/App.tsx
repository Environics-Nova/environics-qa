import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthenticatedLayout } from "@/layouts/AuthenticatedLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";

// ── Pages ──────────────────────────────────────
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import ProjectDetail from "./pages/ProjectDetail";
import EventDetail from "./pages/EventDetail";
import DocumentDetail from "./pages/DocumentDetail";
import NewProject from "./pages/NewProject";
import QAQCProcesses from "./pages/QAQCProcesses";
import QAQCProcessDetail from "./pages/QAQCProcessDetail";
import Questionnaires from "./pages/Questionnaires";
import QuestionnaireDetail from "./pages/QuestionnaireDetail";
import DocumentTypes from "./pages/DocumentTypes";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/**
 * Wraps a page in the authenticated layout with sidebar + header.
 */
const withAuth = (page: React.ReactNode) => (
  <ProtectedRoute>
    <AuthenticatedLayout>{page}</AuthenticatedLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route
            path="/sign-in/*"
            element={<PublicRoute><SignInPage /></PublicRoute>}
          />
          <Route
            path="/sign-up/*"
            element={<PublicRoute><SignUpPage /></PublicRoute>}
          />

          {/* Authenticated routes */}
          <Route path="/dashboard" element={withAuth(<Index />)} />
          <Route path="/project/new" element={withAuth(<NewProject />)} />
          <Route path="/project/:projectId" element={withAuth(<ProjectDetail />)} />
          <Route path="/event/:eventId" element={withAuth(<EventDetail />)} />
          <Route path="/document/:documentId" element={withAuth(<DocumentDetail />)} />
          <Route path="/document-types" element={withAuth(<DocumentTypes />)} />
          <Route path="/qaqc-processes" element={withAuth(<QAQCProcesses />)} />
          <Route path="/qaqc-processes/:processId" element={withAuth(<QAQCProcessDetail />)} />
          <Route path="/questionnaires" element={withAuth(<Questionnaires />)} />
          <Route path="/questionnaires/:id" element={withAuth(<QuestionnaireDetail />)} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
