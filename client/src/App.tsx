import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Menu, LogOut, User } from "lucide-react";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import UserManagement from "@/pages/user-management";
import HuddleManagement from "@/pages/huddle-management";
import NutritionManagement from "@/pages/nutrition-management";
import HomeSettings from "@/pages/home-settings";
import WeightRoom from "@/pages/weight-room";
import AthleteResources from "@/pages/athlete-resources";
import ScheduleCoaching from "@/pages/schedule-coaching";
import Profile from "@/pages/profile";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import PrivacyPolicy from "@/pages/privacy-policy";
import AboutUs from "@/pages/about-us";
import TermsOfService from "@/pages/terms-of-service";
import ContactUs from "@/pages/contact-us";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { coachingSessionQueries, userQueries } from "@/lib/supabase-queries";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/admin" component={Dashboard} />
      <Route path="/users" component={UserManagement} />
      <Route path="/huddles" component={HuddleManagement} />
      <Route path="/nutrition" component={NutritionManagement} />
      <Route path="/weight-room" component={WeightRoom} />
      <Route path="/athlete-resources" component={AthleteResources} />
      <Route path="/schedule-coaching" component={ScheduleCoaching} />
      <Route path="/home-settings" component={HomeSettings} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function NotificationBell() {
  const [location, setLocation] = useLocation();
  
  const { data: sessions = [] } = useQuery({
    queryKey: ['/api/coaching-sessions'],
    queryFn: () => coachingSessionQueries.getAll(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const pendingSessions = sessions.filter(s => s.status === 'pending');
  const pendingCount = pendingSessions.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          data-testid="button-notifications"
        >
          <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          {pendingCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {pendingCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>New Coach Bookings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {pendingCount === 0 ? (
          <div className="px-3 py-4 text-sm text-muted-foreground text-center">
            No new bookings
          </div>
        ) : (
          <>
            <div className="max-h-[400px] overflow-y-auto">
              {pendingSessions.map((session) => (
                <DropdownMenuItem 
                  key={session.id}
                  onClick={() => setLocation('/schedule-coaching')}
                  className="flex flex-col items-start gap-1 py-3 cursor-pointer"
                  data-testid={`notification-${session.id}`}
                >
                  <div className="font-medium">{session.clientName}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(session.sessionDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })} at {session.startTime}
                  </div>
                  <div className="text-xs text-muted-foreground">{session.clientEmail}</div>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setLocation('/schedule-coaching')}
              className="text-center justify-center font-medium text-primary"
              data-testid="view-all-notifications"
            >
              View All Bookings
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserAvatar() {
  const [userId, setUserId] = useState<string | null>(null);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    });
  }, []);

  const { data: user } = useQuery({
    queryKey: ['/users', userId],
    queryFn: () => userQueries.getById(userId!),
    enabled: !!userId,
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full" data-testid="button-user-menu">
          <Avatar>
            <AvatarImage src={user?.avatarUrl || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.displayName ? getInitials(user.displayName) : <User className="h-5 w-5" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => setLocation("/profile")}
          data-testid="menu-item-profile"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={async () => {
            try {
              const { error } = await supabase.auth.signOut();
              if (error) throw error;
              window.location.href = '/sign-in';
            } catch (error: any) {
              console.error('Logout error:', error);
            }
          }}
          data-testid="menu-item-logout"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show public pages without auth
  const publicPages = ["/", "/privacy-policy", "/about-us", "/terms-of-service", "/contact-us"];
  if (publicPages.includes(location)) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {location === "/privacy-policy" ? (
            <PrivacyPolicy />
          ) : location === "/about-us" ? (
            <AboutUs />
          ) : location === "/terms-of-service" ? (
            <TermsOfService />
          ) : location === "/contact-us" ? (
            <ContactUs />
          ) : (
            <Landing />
          )}
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {location === "/sign-up" ? (
            <SignUp onSignUp={() => setLocation("/sign-in")} />
          ) : (
            <SignIn onSignIn={() => setIsAuthenticated(true)} />
          )}
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
                <NotificationBell />
                <ThemeToggle />
                <UserAvatar />
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
