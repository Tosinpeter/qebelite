import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Clock, Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { coachingSessionQueries, coachingAvailabilityQueries } from "@/lib/supabase-queries";

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ScheduleCoachingPage() {
  const { toast } = useToast();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    dayOfWeek: 0,
    startTime: "09:00",
    endTime: "17:00",
    sessionDuration: 60,
  });

  const { data: allAvailability = [], isLoading: availabilityLoading } = useQuery({
    queryKey: ['/api/coaching-availability-all'],
    queryFn: () => coachingAvailabilityQueries.getAll(),
  });

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['/api/coaching-sessions'],
    queryFn: () => coachingSessionQueries.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => coachingAvailabilityQueries.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coaching-availability-all'] });
      queryClient.invalidateQueries({ queryKey: ['/api/coaching-availability'] });
      toast({ title: "Availability Added", description: "New availability slot has been added." });
      setIsAddingNew(false);
      setFormData({ dayOfWeek: 0, startTime: "09:00", endTime: "17:00", sessionDuration: 60 });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to Add", 
        description: error.message || "Failed to add availability",
        variant: "destructive" 
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => coachingAvailabilityQueries.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coaching-availability-all'] });
      queryClient.invalidateQueries({ queryKey: ['/api/coaching-availability'] });
      toast({ title: "Updated", description: "Availability has been updated." });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => coachingAvailabilityQueries.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coaching-availability-all'] });
      queryClient.invalidateQueries({ queryKey: ['/api/coaching-availability'] });
      toast({ title: "Deleted", description: "Availability has been removed." });
    },
  });

  const deleteSessionMutation = useMutation({
    mutationFn: (id: string) => coachingSessionQueries.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coaching-sessions'] });
      toast({ title: "Session Cancelled", description: "Coaching session has been cancelled." });
    },
  });

  const handleAdd = () => {
    createMutation.mutate(formData);
  };

  const toggleActive = (id: string, currentActive: boolean) => {
    updateMutation.mutate({ id, data: { active: !currentActive } });
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Manage Coach Availability</h1>
        <p className="text-muted-foreground">Set your weekly availability for 1:1 coaching sessions. Users book via mobile app.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Availability</CardTitle>
              <CardDescription>Configure your coaching schedule for each day of the week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availabilityLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading availability...</div>
              ) : (
                <>
                  <div className="space-y-2">
                    {allAvailability.map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between p-3 border rounded-md" data-testid={`availability-${slot.id}`}>
                        <div className="flex items-center gap-4">
                          <div className="w-28">
                            <div className="font-medium">{DAYS_OF_WEEK[slot.dayOfWeek]}</div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ({slot.sessionDuration} min sessions)
                          </div>
                          <Badge variant={slot.active ? "default" : "secondary"}>
                            {slot.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleActive(slot.id, slot.active)}
                            disabled={updateMutation.isPending}
                            data-testid={`button-toggle-${slot.id}`}
                          >
                            {slot.active ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteMutation.mutate(slot.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-${slot.id}`}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {!isAddingNew ? (
                    <Button onClick={() => setIsAddingNew(true)} className="w-full" data-testid="button-add-availability">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Availability
                    </Button>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>Add New Availability</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Day of Week</Label>
                            <Select
                              value={String(formData.dayOfWeek)}
                              onValueChange={(value) => setFormData({ ...formData, dayOfWeek: Number(value) })}
                            >
                              <SelectTrigger data-testid="select-day">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {DAYS_OF_WEEK.map((day, idx) => (
                                  <SelectItem key={idx} value={String(idx)}>{day}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Session Duration (minutes)</Label>
                            <Input
                              type="number"
                              value={formData.sessionDuration}
                              onChange={(e) => setFormData({ ...formData, sessionDuration: Number(e.target.value) })}
                              data-testid="input-duration"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Start Time</Label>
                            <Input
                              type="time"
                              value={formData.startTime}
                              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                              data-testid="input-start-time"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Time</Label>
                            <Input
                              type="time"
                              value={formData.endTime}
                              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                              data-testid="input-end-time"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsAddingNew(false);
                              setFormData({ dayOfWeek: 0, startTime: "09:00", endTime: "17:00", sessionDuration: 60 });
                            }}
                            data-testid="button-cancel-add"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleAdd}
                            disabled={createMutation.isPending}
                            data-testid="button-save-availability"
                          >
                            {createMutation.isPending ? "Saving..." : "Save"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Booked Sessions</CardTitle>
              <CardDescription>Sessions booked by users via mobile app</CardDescription>
            </CardHeader>
            <CardContent>
              {sessionsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No sessions booked yet</div>
              ) : (
                <div className="space-y-3">
                  {sessions
                    .filter(s => new Date(s.sessionDate) >= new Date())
                    .slice(0, 10)
                    .map((session) => (
                      <div key={session.id} className="p-3 border rounded-md space-y-2" data-testid={`session-${session.id}`}>
                        <div className="font-medium">{session.clientName}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {format(parseISO(session.sessionDate.toString()), 'MMM d, yyyy')}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {session.startTime} - {session.endTime}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {session.clientEmail}
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">{session.status}</Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteSessionMutation.mutate(session.id)}
                            disabled={deleteSessionMutation.isPending}
                            data-testid={`button-cancel-${session.id}`}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
