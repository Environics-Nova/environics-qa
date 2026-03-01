import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UserButton } from "@clerk/clerk-react";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
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
}
