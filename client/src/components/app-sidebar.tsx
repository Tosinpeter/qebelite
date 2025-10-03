import { Users, Calendar, Apple, Home, Dumbbell, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "wouter";

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
        <div className="px-3 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 px-3">
            <svg className="w-8 h-8" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25.2 0H7.8C3.49218 0 0 3.49218 0 7.8V25.2C0 29.5078 3.49218 33 7.8 33H25.2C29.5078 33 33 29.5078 33 25.2V7.8C33 3.49218 29.5078 0 25.2 0Z" fill="currentColor" className="text-primary"/>
              <path d="M23.1 16.5L16.5 9.9L9.9 16.5L16.5 23.1L23.1 16.5Z" fill="white"/>
            </svg>
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
