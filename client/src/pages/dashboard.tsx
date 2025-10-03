import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Video, Dumbbell } from "lucide-react";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [nextHuddle, setNextHuddle] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const huddle = new Date();
    huddle.setHours(huddle.getHours() + 3);
    huddle.setMinutes(30);
    setNextHuddle(huddle);
  }, []);

  useEffect(() => {
    if (!nextHuddle) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = nextHuddle.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown("Starting now!");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${days > 0 ? `${days}d ` : ""}${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [nextHuddle]);

  const stats = [
    { title: "Total Users", value: "1,247", icon: Users, change: "+12% from last month" },
    { title: "Active Huddles", value: "8", icon: Calendar, change: "3 scheduled today" },
    { title: "Training Videos", value: "156", icon: Video, change: "12 added this week" },
    { title: "Workout Collections", value: "42", icon: Dumbbell, change: "6 categories" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Admin Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor and manage your fitness app
        </p>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Next Huddle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Team Standup - Main Conference</p>
            <div className="text-3xl font-bold font-mono tracking-tight" data-testid="text-countdown">
              {countdown || "Loading..."}
            </div>
            <p className="text-xs text-muted-foreground">
              {nextHuddle?.toLocaleString('en-US', { 
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`text-stat-${index}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { user: "Sarah Johnson", action: "completed workout", time: "2 min ago" },
                { user: "Mike Chen", action: "joined huddle", time: "15 min ago" },
                { user: "Emma Davis", action: "updated meal plan", time: "1 hour ago" },
                { user: "Alex Kim", action: "watched training video", time: "2 hours ago" },
              ].map((activity, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-muted-foreground"> {activity.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-3 text-sm hover-elevate active-elevate-2 rounded-md border" data-testid="button-quick-create-user">
              <div className="font-medium">Create New User</div>
              <div className="text-xs text-muted-foreground">Add a member to the platform</div>
            </button>
            <button className="w-full text-left p-3 text-sm hover-elevate active-elevate-2 rounded-md border" data-testid="button-quick-schedule-huddle">
              <div className="font-medium">Schedule Huddle</div>
              <div className="text-xs text-muted-foreground">Plan the next team meeting</div>
            </button>
            <button className="w-full text-left p-3 text-sm hover-elevate active-elevate-2 rounded-md border" data-testid="button-quick-upload-video">
              <div className="font-medium">Upload Training Video</div>
              <div className="text-xs text-muted-foreground">Add new content to library</div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
