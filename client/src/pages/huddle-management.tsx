import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar as CalendarIcon, Clock, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Huddle = {
  id: string;
  title: string;
  description: string;
  scheduledAt: Date;
  duration: number;
  status: string;
};

export default function HuddleManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nextHuddle, setNextHuddle] = useState<Huddle | null>(null);
  const [countdown, setCountdown] = useState("");

  const mockHuddles: Huddle[] = [
    {
      id: "1",
      title: "Team Standup",
      description: "Daily team sync and progress updates",
      scheduledAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
      duration: 30,
      status: "upcoming"
    },
    {
      id: "2",
      title: "Weekly Planning",
      description: "Plan next week's training schedule",
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      duration: 60,
      status: "upcoming"
    },
    {
      id: "3",
      title: "Nutrition Workshop",
      description: "Monthly nutrition education session",
      scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      duration: 90,
      status: "upcoming"
    },
  ];

  useEffect(() => {
    const upcoming = mockHuddles
      .filter(h => h.status === "upcoming")
      .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())[0];
    setNextHuddle(upcoming);
  }, []);

  useEffect(() => {
    if (!nextHuddle) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = nextHuddle.scheduledAt.getTime() - now.getTime();

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Huddle Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Schedule and manage team meetings
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} data-testid="button-create-huddle">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Huddle
        </Button>
      </div>

      {nextHuddle && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Next Huddle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="font-semibold text-lg" data-testid="text-next-huddle-title">{nextHuddle.title}</div>
                <p className="text-sm text-muted-foreground">{nextHuddle.description}</p>
              </div>
              <div className="text-3xl font-bold font-mono tracking-tight" data-testid="text-huddle-countdown">
                {countdown || "Loading..."}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  {nextHuddle.scheduledAt.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {nextHuddle.duration} min
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Huddles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockHuddles.map((huddle) => (
              <div
                key={huddle.id}
                className="p-4 rounded-md border hover-elevate"
                data-testid={`huddle-item-${huddle.id}`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-medium">{huddle.title}</div>
                      <Badge variant="outline">{huddle.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {huddle.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {huddle.scheduledAt.toLocaleString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {huddle.duration} min
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" data-testid={`button-edit-huddle-${huddle.id}`}>
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent data-testid="dialog-huddle-form">
          <DialogHeader>
            <DialogTitle>Schedule New Huddle</DialogTitle>
            <DialogDescription>
              Create a new team meeting
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Team Standup" data-testid="input-huddle-title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="What will this huddle be about?" data-testid="input-huddle-description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date & Time</Label>
                <Input id="date" type="datetime-local" data-testid="input-huddle-datetime" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input id="duration" type="number" placeholder="30" data-testid="input-huddle-duration" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)} data-testid="button-save-huddle">
              Schedule Huddle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
