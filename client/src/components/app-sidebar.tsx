import { Users, Calendar, Apple, Home, Dumbbell, LayoutDashboard, BookOpen } from "lucide-react";
import { Link, useLocation } from "wouter";
import logoImage from "@assets/logo_1759665184540.png";

const menuGroups = [
  {
    label: null,
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
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
    ],
  },
  {
    label: "CONTENT",
    items: [
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
        title: "Athlete Resources",
        url: "/athlete-resources",
        icon: BookOpen,
      },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      {
        title: "Home Layout",
        url: "/home-settings",
        icon: Home,
      },
    ],
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <aside className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="px-3 py-4 border-b border-gray-200 dark:border-gray-700 pt-[18px] pb-[18px]">
          <div className="flex items-center gap-2 px-3">
            <img 
              src={logoImage} 
              alt="QEB Elite Logo" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-semibold text-gray-900 dark:text-white">QEB Elite</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex} className={groupIndex > 0 ? 'mt-6' : ''}>
              {group.label && (
                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {group.label}
                </h3>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.url;
                  
                  return (
                    <li key={item.title}>
                      <Link
                        href={item.url}
                        data-testid={`link-nav-${item.title.toLowerCase().replace(' ', '-')}`}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        
      </div>
    </aside>
  );
}
