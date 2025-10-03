import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Video, Dumbbell } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { title: "Total Users", value: "1,247", icon: Users, change: "+12% from last month", color: "text-blue-600" },
    { title: "Active Huddles", value: "8", icon: Calendar, change: "3 scheduled today", color: "text-green-600" },
    { title: "Training Videos", value: "156", icon: Video, change: "12 added this week", color: "text-purple-600" },
    { title: "Workout Collections", value: "42", icon: Dumbbell, change: "6 categories", color: "text-orange-600" },
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
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { user: "Sarah Johnson", action: "completed workout", time: "2 min ago" },
                { user: "Mike Chen", action: "joined huddle", time: "15 min ago" },
                { user: "Emma Davis", action: "updated meal plan", time: "1 hour ago" },
                { user: "Alex Kim", action: "watched training video", time: "2 hours ago" },
              ].map((activity, i) => (
                <div key={i} className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">{activity.user}</span>
                    <span className="text-gray-500 dark:text-gray-400"> {activity.action}</span>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Users Today</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">432</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Completed Workouts</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">1,284</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg Session Time</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">45 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">User Satisfaction</span>
                <span className="text-sm font-semibold text-green-600">94%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
