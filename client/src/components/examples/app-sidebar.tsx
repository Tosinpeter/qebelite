import { AppSidebar } from '../app-sidebar';
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppSidebarExample() {
  return (
    <SidebarProvider>
      <div className="h-screen w-full flex">
        <AppSidebar />
      </div>
    </SidebarProvider>
  );
}
