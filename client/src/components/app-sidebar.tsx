import { Users, Calendar, Apple, Home, Dumbbell, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "wouter";

const menuItems = [
  {
    title: "Overview",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Huddles",
    url: "/huddles",
    icon: Calendar,
  },
  {
    title: "Nutrition",
    url: "/nutrition",
    icon: Apple,
  },
  {
    title: "Weight Room",
    url: "/weight-room",
    icon: Dumbbell,
  },
  {
    title: "Home Settings",
    url: "/home-settings",
    icon: Home,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <aside className="h-full border-r bg-sidebar border-sidebar-border">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">Flowbite</span>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.url;
            
            return (
              <Link
                key={item.title}
                href={item.url}
                data-testid={`link-nav-${item.title.toLowerCase().replace(' ', '-')}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
