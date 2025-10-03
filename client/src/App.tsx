import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { TextInput, Button, Avatar } from "flowbite-react";
import { HiBell, HiViewGrid, HiSearch, HiMenuAlt1 } from "react-icons/hi";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import UserManagement from "@/pages/user-management";
import HuddleManagement from "@/pages/huddle-management";
import NutritionManagement from "@/pages/nutrition-management";
import HomeSettings from "@/pages/home-settings";
import WeightRoom from "@/pages/weight-room";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/users" component={UserManagement} />
      <Route path="/huddles" component={HuddleManagement} />
      <Route path="/nutrition" component={NutritionManagement} />
      <Route path="/home-settings" component={HomeSettings} />
      <Route path="/weight-room" component={WeightRoom} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen w-full bg-background">
          <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}>
            <AppSidebar />
          </aside>
          <div className="flex flex-col flex-1 overflow-hidden">
            <header className="flex items-center justify-between gap-4 px-4 py-3 border-b bg-card">
              <div className="flex items-center gap-4 flex-1">
                <Button
                  color="gray"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  data-testid="button-sidebar-toggle"
                  className="p-2"
                >
                  <HiMenuAlt1 className="h-5 w-5" />
                </Button>
                <div className="relative flex-1 max-w-md">
                  <TextInput
                    icon={HiSearch}
                    type="search"
                    placeholder="Search"
                    sizing="md"
                    data-testid="input-global-search"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button color="gray" size="sm" className="p-2" data-testid="button-notifications">
                  <HiBell className="h-5 w-5" />
                </Button>
                <Button color="gray" size="sm" className="p-2" data-testid="button-grid-view">
                  <HiViewGrid className="h-5 w-5" />
                </Button>
                <ThemeToggle />
                <Avatar rounded size="sm" />
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6 bg-background">
              <div className="max-w-7xl mx-auto">
                <Router />
              </div>
            </main>
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
