import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { coachingSessionQueries, coachingAvailabilityQueries } from "@/lib/supabase-queries";
import type { CoachingSession } from "@shared/schema";

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function AvailabilityManager({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    dayOfWeek: 0,
    startTime: "09:00",
    endTime: "17:00",
    sessionDuration: 60,
  });

  const { data: allAvailability = [], isLoading } = useQuery({
    queryKey: ['/api/coaching-availability-all'],
    queryFn: () => coachingAvailabilityQueries.getAll(),
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

  const handleAdd = () => {
    createMutation.mutate(formData);
  };

  const toggleActive = (id: string, currentActive: boolean) => {
    updateMutation.mutate({ id, data: { active: !currentActive } });
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
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
    </div>
  );
}

export default function ScheduleCoachingPage() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    notes: "",
  });

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['/api/coaching-sessions'],
    queryFn: () => coachingSessionQueries.getAll(),
  });

  const { data: availability = [], isLoading: availabilityLoading } = useQuery({
    queryKey: ['/api/coaching-availability'],
    queryFn: () => coachingAvailabilityQueries.getActive(),
  });

  const createSessionMutation = useMutation({
    mutationFn: (session: Partial<CoachingSession>) => coachingSessionQueries.create(session),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coaching-sessions'] });
      toast({ title: "Session Booked", description: "Coaching session has been scheduled successfully." });
      setBookingDialogOpen(false);
      setFormData({ clientName: "", clientEmail: "", clientPhone: "", notes: "" });
      setSelectedTimeSlot("");
    },
    onError: (error: any) => {
      toast({ 
        title: "Booking Failed", 
        description: error.message || "Failed to book session",
        variant: "destructive" 
      });
    },
  });

  const deleteSessionMutation = useMutation({
    mutationFn: (id: string) => coachingSessionQueries.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coaching-sessions'] });
      toast({ title: "Session Cancelled", description: "Coaching session has been cancelled." });
    },
  });

  const getAvailableTimeSlotsForDate = (date: Date) => {
    const dayOfWeek = date.getDay();
    const dayAvailability = availability.filter(a => a.dayOfWeek === dayOfWeek);
    
    const bookedSlots = sessions
      .filter(s => isSameDay(parseISO(s.sessionDate.toString()), date))
      .map(s => s.startTime);

    const slots: string[] = [];
    dayAvailability.forEach(avail => {
      const [startHour, startMin] = avail.startTime.split(':').map(Number);
      const [endHour, endMin] = avail.endTime.split(':').map(Number);
      
      let currentHour = startHour;
      let currentMin = startMin;
      
      while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        const timeSlot = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
        if (!bookedSlots.includes(timeSlot)) {
          slots.push(timeSlot);
        }
        
        currentMin += avail.sessionDuration;
        if (currentMin >= 60) {
          currentHour += Math.floor(currentMin / 60);
          currentMin = currentMin % 60;
        }
      }
    });

    return slots;
  };

  const handleBookSession = () => {
    if (!formData.clientName || !formData.clientEmail || !selectedTimeSlot) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const sessionDuration = availability.find(a => a.dayOfWeek === selectedDate.getDay())?.sessionDuration || 60;
    const [startHour, startMin] = selectedTimeSlot.split(':').map(Number);
    const endMin = startMin + sessionDuration;
    const endHour = startHour + Math.floor(endMin / 60);
    const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}`;

    createSessionMutation.mutate({
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      sessionDate: selectedDate,
      startTime: selectedTimeSlot,
      endTime,
      status: "confirmed",
      notes: formData.notes,
    });
  };

  const getWeekDates = () => {
    const start = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const weekDates = getWeekDates();
  const availableSlots = getAvailableTimeSlotsForDate(selectedDate);

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Schedule 1:1 Coaching</h1>
          <p className="text-muted-foreground">Book coaching sessions and manage availability</p>
        </div>
        <Dialog open={availabilityDialogOpen} onOpenChange={setAvailabilityDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" data-testid="button-manage-availability">
              <Settings className="h-4 w-4 mr-2" />
              Manage Availability
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Manage Coaching Availability</DialogTitle>
              <DialogDescription>
                Set your weekly availability for 1:1 coaching sessions
              </DialogDescription>
            </DialogHeader>
            <AvailabilityManager onClose={() => setAvailabilityDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="calendar" className="flex-1">
        <TabsList>
          <TabsTrigger value="calendar" data-testid="tab-calendar">Calendar</TabsTrigger>
          <TabsTrigger value="sessions" data-testid="tab-sessions">All Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
                <CardDescription>Choose a date and available time slot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-7 gap-2">
                  {weekDates.map((date, idx) => {
                    const isSelected = isSameDay(date, selectedDate);
                    const hasAvailability = availability.some(a => a.dayOfWeek === date.getDay());
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedDate(date)}
                        className={`p-3 rounded-md border text-center transition-colors ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary'
                            : hasAvailability
                            ? 'hover-elevate active-elevate-2 border-border'
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                        disabled={!hasAvailability}
                        data-testid={`button-date-${format(date, 'yyyy-MM-dd')}`}
                      >
                        <div className="text-xs text-muted-foreground">{DAYS_OF_WEEK[date.getDay()].slice(0, 3)}</div>
                        <div className="text-lg font-semibold">{format(date, 'd')}</div>
                        <div className="text-xs">{format(date, 'MMM')}</div>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <Label className="mb-3 block">Available Time Slots for {format(selectedDate, 'EEEE, MMMM d')}</Label>
                  {availabilityLoading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading availability...</div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No available slots for this date
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => {
                            setSelectedTimeSlot(slot);
                            setBookingDialogOpen(true);
                          }}
                          className={`p-3 rounded-md border text-center hover-elevate active-elevate-2 ${
                            selectedTimeSlot === slot ? 'bg-primary text-primary-foreground' : ''
                          }`}
                          data-testid={`button-timeslot-${slot}`}
                        >
                          <Clock className="h-4 w-4 mx-auto mb-1" />
                          <div className="text-sm font-medium">{slot}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Next scheduled coaching sessions</CardDescription>
              </CardHeader>
              <CardContent>
                {sessionsLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : sessions.filter(s => new Date(s.sessionDate) >= new Date()).slice(0, 5).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No upcoming sessions</div>
                ) : (
                  <div className="space-y-3">
                    {sessions
                      .filter(s => new Date(s.sessionDate) >= new Date())
                      .slice(0, 5)
                      .map((session) => (
                        <div key={session.id} className="p-3 border rounded-md space-y-1" data-testid={`session-${session.id}`}>
                          <div className="font-medium">{session.clientName}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(parseISO(session.sessionDate.toString()), 'MMM d, yyyy')} at {session.startTime}
                          </div>
                          <Badge variant="secondary" className="text-xs">{session.status}</Badge>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>All Coaching Sessions</CardTitle>
              <CardDescription>View and manage all scheduled sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {sessionsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading sessions...</div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No sessions scheduled</div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-md" data-testid={`session-row-${session.id}`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <div className="font-medium">{session.clientName}</div>
                          <Badge variant="secondary">{session.status}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {format(parseISO(session.sessionDate.toString()), 'MMM d, yyyy')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.startTime} - {session.endTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {session.clientEmail}
                          </div>
                        </div>
                        {session.notes && (
                          <div className="text-sm text-muted-foreground mt-2">Notes: {session.notes}</div>
                        )}
                      </div>
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Coaching Session</DialogTitle>
            <DialogDescription>
              {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTimeSlot}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Client Name *</Label>
              <Input
                id="client-name"
                placeholder="Enter client name"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                data-testid="input-client-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-email">Email *</Label>
              <Input
                id="client-email"
                type="email"
                placeholder="client@example.com"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                data-testid="input-client-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-phone">Phone Number</Label>
              <Input
                id="client-phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                data-testid="input-client-phone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special notes or requests..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                data-testid="input-notes"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setBookingDialogOpen(false)}
                data-testid="button-cancel-booking"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBookSession}
                disabled={createSessionMutation.isPending}
                data-testid="button-confirm-booking"
              >
                {createSessionMutation.isPending ? "Booking..." : "Book Session"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
