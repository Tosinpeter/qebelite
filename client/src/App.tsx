import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Grid3x3, Search } from "lucide-react";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import UserManagement from "@/pages/user-management";
import HuddleManagement from "@/pages/huddle-management";
import NutritionManagement from "@/pages/nutrition-management";
import HomeSettings from "@/pages/home-settings";
import WeightRoom from "@/pages/weight-room";

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
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between gap-4 px-4 py-3 border-b bg-card">
                <div className="flex items-center gap-4 flex-1">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search"
                      className="pl-9"
                      data-testid="input-global-search"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" data-testid="button-notifications">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" data-testid="button-grid-view">
                    <Grid3x3 className="h-5 w-5" />
                  </Button>
                  <ThemeToggle />
                  <Avatar>
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </div>
              </header>
              <main className="flex-1 overflow-y-auto p-6 bg-background">
                <div className="max-w-7xl mx-auto">
                  <Router />
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
