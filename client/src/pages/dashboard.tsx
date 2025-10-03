import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState("Dec 31 - Jan 31");

  const weeklyData = [
    { label: "Mon", sales: 85, prev: 65 },
    { label: "Tue", sales: 120, prev: 95 },
    { label: "Wed", sales: 95, prev: 110 },
    { label: "Thu", sales: 110, prev: 85 },
    { label: "Fri", sales: 75, prev: 100 },
    { label: "Sat", sales: 130, prev: 115 },
    { label: "Sun", sales: 95, prev: 80 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total sales</div>
              <div className="text-3xl font-bold" data-testid="text-total-sales">$47,867</div>
            </div>
            <Button variant="outline" size="sm" className="gap-2" data-testid="button-date-range">
              <Calendar className="h-4 w-4" />
              {dateRange}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2">
            {/* Simple line chart visualization using divs */}
            <div className="flex-1 h-full flex flex-col justify-end">
              <div className="text-xs text-center text-muted-foreground mb-2">Mar</div>
              <div className="bg-primary/20 rounded-t" style={{ height: '45%' }}></div>
            </div>
            <div className="flex-1 h-full flex flex-col justify-end">
              <div className="text-xs text-center text-muted-foreground mb-2">02 Mar</div>
              <div className="bg-primary/20 rounded-t" style={{ height: '55%' }}></div>
            </div>
            <div className="flex-1 h-full flex flex-col justify-end">
              <div className="text-xs text-center text-muted-foreground mb-2">03 Mar</div>
              <div className="bg-primary/20 rounded-t" style={{ height: '40%' }}></div>
            </div>
            <div className="flex-1 h-full flex flex-col justify-end">
              <div className="text-xs text-center text-muted-foreground mb-2">04 Mar</div>
              <div className="bg-primary/20 rounded-t" style={{ height: '50%' }}></div>
            </div>
            <div className="flex-1 h-full flex flex-col justify-end">
              <div className="text-xs text-center text-muted-foreground mb-2">05 Mar</div>
              <div className="bg-primary/20 rounded-t" style={{ height: '70%' }}></div>
            </div>
            <div className="flex-1 h-full flex flex-col justify-end">
              <div className="text-xs text-center text-muted-foreground mb-2">06 Mar</div>
              <div className="bg-primary/20 rounded-t" style={{ height: '65%' }}></div>
            </div>
            <div className="flex-1 h-full flex flex-col justify-end">
              <div className="text-xs text-center text-muted-foreground mb-2">07 Mar</div>
              <div className="bg-primary rounded-t" style={{ height: '85%' }}></div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span>Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-2"></div>
              <span>Revenue (previous period)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold" data-testid="text-new-products">7,564</div>
                <div className="text-sm text-muted-foreground">New products this week</div>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                <TrendingUp className="h-3 w-3 mr-1" />
                7%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-end justify-between gap-1">
              {weeklyData.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col gap-1">
                    <div className="bg-primary rounded-t" style={{ height: `${day.sales}px` }}></div>
                    <div className="bg-chart-2 rounded-t" style={{ height: `${day.prev}px` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base font-medium">Website traffic</CardTitle>
              <Button variant="outline" size="sm" className="h-7 text-xs" data-testid="button-traffic-range">
                31 Nov - 31 Dec
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="20" strokeDasharray="157 94" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="20" strokeDasharray="63 188" strokeDashoffset="-157" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--chart-3))" strokeWidth="20" strokeDasharray="31 220" strokeDashoffset="-220" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                  Traffic
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Direct</span>
                </div>
                <span className="font-medium">62.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-chart-2"></div>
                  <span>Organic search</span>
                </div>
                <span className="font-medium">25.4%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-chart-3"></div>
                  <span>Referrals</span>
                </div>
                <span className="font-medium">11.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Clicks</div>
                <div className="text-2xl font-bold" data-testid="text-clicks">42.3k</div>
              </div>
              <div className="space-y-1 text-right">
                <div className="text-sm text-muted-foreground">CPC</div>
                <div className="text-2xl font-bold" data-testid="text-cpc">$5.40</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-20 flex items-center">
              <svg viewBox="0 0 200 40" className="w-full h-full">
                <path
                  d="M 0 20 Q 25 10, 50 20 T 100 20 T 150 20 T 200 15"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                />
                <path
                  d="M 0 25 Q 25 35, 50 25 T 100 25 T 150 25 T 200 30"
                  fill="none"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4" data-testid="button-view-report">
              View full report
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Performing Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Sarah Johnson", workouts: 28, trend: "up", change: 12 },
                { name: "Mike Chen", workouts: 24, trend: "up", change: 8 },
                { name: "Emma Davis", workouts: 22, trend: "down", change: 3 },
                { name: "Alex Kim", workouts: 20, trend: "up", change: 5 },
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.workouts} workouts</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${user.trend === 'up' ? 'text-primary' : 'text-destructive'}`}>
                    {user.trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {user.change}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
                <div key={i} className="flex justify-between items-start text-sm">
                  <div className="flex-1">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-muted-foreground"> {activity.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
