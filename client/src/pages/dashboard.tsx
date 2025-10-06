import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Video, Dumbbell, Apple } from "lucide-react";
import { 
  userQueries, 
  huddleQueries, 
  nutritionVideoQueries,
  weightRoomQueries,
  coachingSessionQueries,
  recipeQueries
} from "@/lib/supabase-queries";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
    queryFn: () => userQueries.getAll(),
  });

  const { data: huddles = [] } = useQuery({
    queryKey: ['/api/huddles'],
    queryFn: () => huddleQueries.getAll(),
  });

  const { data: nutritionVideos = [] } = useQuery({
    queryKey: ['/api/nutrition-videos'],
    queryFn: () => nutritionVideoQueries.getAll(),
  });

  const { data: collections = [] } = useQuery({
    queryKey: ['/api/weight-room-collections'],
    queryFn: () => weightRoomQueries.getAll(),
  });

  const { data: coachingSessions = [] } = useQuery({
    queryKey: ['/api/coaching-sessions'],
    queryFn: () => coachingSessionQueries.getAll(),
  });

  const { data: recipes = [] } = useQuery({
    queryKey: ['/api/recipes'],
    queryFn: () => recipeQueries.getAll(),
  });

  const upcomingHuddles = huddles.filter(h => 
    h.status === 'upcoming' && new Date(h.scheduledAt) >= new Date()
  );

  const todayHuddles = huddles.filter(h => {
    const huddleDate = new Date(h.scheduledAt);
    const today = new Date();
    return huddleDate.toDateString() === today.toDateString();
  });

  const recentSessions = coachingSessions
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5);

  const stats = [
    { 
      title: "Total Users", 
      value: users.length.toLocaleString(), 
      icon: Users, 
      change: `${users.filter(u => u.role === 'user').length} athletes`, 
      color: "text-blue-600" 
    },
    { 
      title: "Active Huddles", 
      value: upcomingHuddles.length.toString(), 
      icon: Calendar, 
      change: `${todayHuddles.length} scheduled today`, 
      color: "text-green-600" 
    },
    { 
      title: "Content Library", 
      value: nutritionVideos.length.toString(), 
      icon: Video, 
      change: "nutrition videos", 
      color: "text-purple-600" 
    },
    { 
      title: "Workout Collections", 
      value: collections.length.toString(), 
      icon: Dumbbell, 
      change: "weight room", 
      color: "text-orange-600" 
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-page-title">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Overview of your fitness app performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white" data-testid={`text-stat-${index}`}>{stat.value}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSessions.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No recent coaching sessions
                </div>
              ) : (
                recentSessions.map((session) => (
                  <div 
                    key={session.id} 
                    className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0"
                  >
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">{session.clientName}</span>
                      <span className="text-gray-500 dark:text-gray-400"> booked coaching</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {session.createdAt ? formatDistanceToNow(new Date(session.createdAt), { addSuffix: true }) : 'Recently'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Content Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Recipes</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{recipes.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Nutrition Videos</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{nutritionVideos.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Weight Room Collections</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{collections.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pending Coach Sessions</span>
                <span className="text-sm font-semibold text-orange-600">
                  {coachingSessions.filter(s => s.status === 'pending').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
