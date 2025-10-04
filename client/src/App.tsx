import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Grid3x3, Search, Menu } from "lucide-react";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import UserManagement from "@/pages/user-management";
import HuddleManagement from "@/pages/huddle-management";
import NutritionManagement from "@/pages/nutrition-management";
import HomeSettings from "@/pages/home-settings";
import WeightRoom from "@/pages/weight-room";
import SignIn from "@/pages/sign-in";
import SupabaseTest from "@/pages/supabase-test";
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
      <Route path="/supabase-test" component={SupabaseTest} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SignIn onSignIn={() => setIsAuthenticated(true)} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900">
          <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}>
            <AppSidebar />
          </aside>
          <div className="flex flex-col flex-1 overflow-hidden">
            <header className="flex items-center justify-between gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-4 flex-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  data-testid="button-sidebar-toggle"
                >
                  <Menu className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </Button>
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                  <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </Button>
                <Button variant="ghost" size="icon" data-testid="button-grid-view">
                  <Grid3x3 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </Button>
                <ThemeToggle />
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
                </Avatar>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
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
