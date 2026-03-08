import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import {
  workoutPlanQueries,
  workoutPlanWeekQueries,
  workoutPlanDayQueries,
  workoutPlanExerciseQueries,
} from "@/lib/supabase-queries";
import { useToast } from "@/hooks/use-toast";
import type {
  WorkoutPlan,
  WorkoutPlanWeek,
  WorkoutPlanDay,
  WorkoutPlanExercise,
} from "@shared/schema";

export default function WorkoutPlansPage() {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);
  const [weekDialogOpen, setWeekDialogOpen] = useState(false);
  const [editingWeek, setEditingWeek] = useState<WorkoutPlanWeek | null>(null);
  const [dayDialogOpen, setDayDialogOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<WorkoutPlanDay | null>(null);
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] =
    useState<WorkoutPlanExercise | null>(null);

  const [planForm, setPlanForm] = useState({
    name: "",
    description: "",
    periodType: "week" as "week" | "month",
  });
  const [weekForm, setWeekForm] = useState({ label: "", sortOrder: 0 });
  const [dayForm, setDayForm] = useState({ label: "", sortOrder: 0 });
  const [exerciseForm, setExerciseForm] = useState({
    exerciseName: "",
    sets: "",
    reps: "",
    sortOrder: 0,
  });

  const [dayDialogWeekId, setDayDialogWeekId] = useState<string | null>(null);
  const [exerciseDialogDayId, setExerciseDialogDayId] = useState<string | null>(
    null,
  );

  const { data: plans = [], isLoading: plansLoading } = useQuery<
    WorkoutPlan[]
  >({
    queryKey: ["workout-plans"],
    queryFn: workoutPlanQueries.getAll,
  });

  const { data: weeks = [] } = useQuery<WorkoutPlanWeek[]>({
    queryKey: ["workout-plan-weeks", selectedPlan?.id],
    queryFn: () =>
      selectedPlan ? workoutPlanWeekQueries.getByPlanId(selectedPlan.id) : [],
    enabled: !!selectedPlan?.id,
  });

  const planIds = selectedPlan ? [selectedPlan.id] : [];
  const { data: daysByWeek = {} } = useQuery({
    queryKey: ["workout-plan-days", weeks.map((w) => w.id)],
    queryFn: async () => {
      const out: Record<string, WorkoutPlanDay[]> = {};
      for (const w of weeks) {
        out[w.id] = await workoutPlanDayQueries.getByWeekId(w.id);
      }
      return out;
    },
    enabled: weeks.length > 0,
  });

  const allDayIds = weeks.flatMap((w) => (daysByWeek[w.id] ?? []).map((d) => d.id));
  const { data: exercisesByDay = {} } = useQuery({
    queryKey: ["workout-plan-exercises", allDayIds],
    queryFn: async () => {
      const out: Record<string, WorkoutPlanExercise[]> = {};
      for (const dayId of allDayIds) {
        out[dayId] = await workoutPlanExerciseQueries.getByDayId(dayId);
      }
      return out;
    },
    enabled: allDayIds.length > 0,
  });

  const createPlanMutation = useMutation({
    mutationFn: (data: Partial<WorkoutPlan>) => workoutPlanQueries.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-plans"] });
      toast({ title: "Plan created" });
      setPlanDialogOpen(false);
    },
    onError: (e: unknown) => {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed",
        variant: "destructive",
      });
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<WorkoutPlan>;
    }) => workoutPlanQueries.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-plans"] });
      toast({ title: "Plan updated" });
      setPlanDialogOpen(false);
    },
    onError: (e: unknown) => {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed",
        variant: "destructive",
      });
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: (id: string) => workoutPlanQueries.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-plans"] });
      setSelectedPlan(null);
      toast({ title: "Plan deleted" });
    },
    onError: (e: unknown) => {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed",
        variant: "destructive",
      });
    },
  });

  const createWeekMutation = useMutation({
    mutationFn: (data: Partial<WorkoutPlanWeek>) =>
      workoutPlanWeekQueries.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workout-plan-weeks", selectedPlan?.id],
      });
      toast({ title: "Week added" });
      setWeekDialogOpen(false);
    },
    onError: (e: unknown) => {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed",
        variant: "destructive",
      });
    },
  });

  const updateWeekMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<WorkoutPlanWeek>;
    }) => workoutPlanWeekQueries.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workout-plan-weeks", selectedPlan?.id],
      });
      toast({ title: "Week updated" });
      setWeekDialogOpen(false);
    },
    onError: (e: unknown) => {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed",
        variant: "destructive",
      });
    },
  });

  const deleteWeekMutation = useMutation({
    mutationFn: (id: string) => workoutPlanWeekQueries.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workout-plan-weeks", selectedPlan?.id],
      });
      toast({ title: "Week deleted" });
    },
    onError: (e: unknown) => {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed",
        variant: "destructive",
      });
    },
  });

  const createDayMutation = useMutation({
    mutationFn: (data: Partial<WorkoutPlanDay>) =>
      workoutPlanDayQueries.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-plan-days"] });
      toast({ title: "Day added" });
      setDayDialogOpen(false);
    },
    onError: (e: unknown) => {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed",
        variant: "destructive",
      });
    },
  });

  const updateDayMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<WorkoutPlanDay>;
    }) => workoutPlanDayQueries.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-plan-days"] });
      toast({ title: "Day updated" });
      setDayDialogOpen(false);
    },
    onError: (e: unknown) => {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed",
        variant: "destructive",
      });
    },
  });

  const deleteDayMutation = useMutation({
    mutationFn: (id: string) => workoutPlanDayQueries.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-plan-days"] });
      toast({ title: "Day deleted" });
    },
    onError: (e: unknown) => {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed",
        variant: "destructive",
      });
    },
  });

  const createExerciseMutation = useMutation({
    mutationFn: (data: Partial<WorkoutPlanExercise>) =>
      workoutPlanExerciseQueries.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-plan-exercises"] });
      toast({ title: "Exercise added" });
      setExerciseDialogOpen(false);
    },
    onError: (e: unknown) => {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed",
        variant: "destructive",
      });
    },
  });

  const updateExerciseMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<WorkoutPlanExercise>;
    }) => workoutPlanExerciseQueries.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-plan-exercises"] });
      toast({ title: "Exercise updated" });
      setExerciseDialogOpen(false);
    },
    onError: (e: unknown) => {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed",
        variant: "destructive",
      });
    },
  });

  const deleteExerciseMutation = useMutation({
    mutationFn: (id: string) => workoutPlanExerciseQueries.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-plan-exercises"] });
      toast({ title: "Exercise deleted" });
    },
    onError: (e: unknown) => {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed",
        variant: "destructive",
      });
    },
  });

  const handleOpenPlanForm = (plan?: WorkoutPlan) => {
    setEditingPlan(plan ?? null);
    setPlanForm({
      name: plan?.name ?? "",
      description: plan?.description ?? "",
      periodType: (plan?.periodType as "week" | "month") ?? "week",
    });
    setPlanDialogOpen(true);
  };

  const handleSavePlan = () => {
    if (!planForm.name.trim()) {
      toast({ variant: "destructive", title: "Name is required" });
      return;
    }
    if (editingPlan) {
      updatePlanMutation.mutate({ id: editingPlan.id, data: planForm });
    } else {
      createPlanMutation.mutate(planForm);
    }
  };

  const handleOpenWeekForm = (week?: WorkoutPlanWeek) => {
    setEditingWeek(week ?? null);
    setWeekForm({
      label: week?.label ?? "",
      sortOrder: week?.sortOrder ?? weeks.length,
    });
    setWeekDialogOpen(true);
  };

  const handleSaveWeek = () => {
    if (!selectedPlan || !weekForm.label.trim()) {
      toast({ variant: "destructive", title: "Week label is required" });
      return;
    }
    if (editingWeek) {
      updateWeekMutation.mutate({
        id: editingWeek.id,
        data: weekForm,
      });
    } else {
      createWeekMutation.mutate({
        planId: selectedPlan.id,
        ...weekForm,
      });
    }
  };

  const handleOpenDayForm = (weekId: string, day?: WorkoutPlanDay) => {
    setDayDialogWeekId(weekId);
    setEditingDay(day ?? null);
    setDayForm({
      label: day?.label ?? "",
      sortOrder: day?.sortOrder ?? 0,
    });
    setDayDialogOpen(true);
  };

  const handleSaveDay = () => {
    if (!dayDialogWeekId || !dayForm.label.trim()) {
      toast({ variant: "destructive", title: "Day label is required" });
      return;
    }
    if (editingDay) {
      updateDayMutation.mutate({
        id: editingDay.id,
        data: dayForm,
      });
    } else {
      createDayMutation.mutate({
        weekId: dayDialogWeekId,
        ...dayForm,
      });
    }
  };

  const handleOpenExerciseForm = (dayId: string, exercise?: WorkoutPlanExercise) => {
    setExerciseDialogDayId(dayId);
    setEditingExercise(exercise ?? null);
    setExerciseForm({
      exerciseName: exercise?.exerciseName ?? "",
      sets: exercise?.sets ?? "",
      reps: exercise?.reps ?? "",
      sortOrder: exercise?.sortOrder ?? 0,
    });
    setExerciseDialogOpen(true);
  };

  const handleSaveExercise = () => {
    if (!exerciseDialogDayId || !exerciseForm.exerciseName.trim()) {
      toast({ variant: "destructive", title: "Exercise name is required" });
      return;
    }
    if (!exerciseForm.sets.trim() || !exerciseForm.reps.trim()) {
      toast({ variant: "destructive", title: "Sets and reps are required" });
      return;
    }
    if (editingExercise) {
      updateExerciseMutation.mutate({
        id: editingExercise.id,
        data: exerciseForm,
      });
    } else {
      createExerciseMutation.mutate({
        dayId: exerciseDialogDayId,
        ...exerciseForm,
      });
    }
  };

  if (selectedPlan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedPlan(null)}
            data-testid="button-back-plans"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold" data-testid="text-plan-title">
              {selectedPlan.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedPlan.description || "No description"}
            </p>
            <Badge variant="secondary" className="mt-2">
              {selectedPlan.periodType === "month" ? "Monthly" : "Weekly"} plan
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenPlanForm(selectedPlan)}
              data-testid="button-edit-plan"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Plan
            </Button>
            <Button
              onClick={() => handleOpenWeekForm()}
              data-testid="button-add-week"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Week
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {weeks.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              No weeks yet. Click &quot;Add Week&quot; to add (e.g. Week 1, Week
              5).
            </p>
          ) : (
            weeks.map((week) => {
              const days = daysByWeek[week.id] ?? [];
              return (
                <Collapsible key={week.id} defaultOpen>
                  <Card data-testid={`week-card-${week.id}`}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer flex flex-row items-center justify-between space-y-0 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{week.label}</span>
                          <Badge variant="outline">{days.length} days</Badge>
                        </div>
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              handleOpenWeekForm(week);
                            }}
                            data-testid={`button-edit-week-${week.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              if (confirm(`Delete ${week.label}?`))
                                deleteWeekMutation.mutate(week.id);
                            }}
                            className="text-red-600"
                            data-testid={`button-delete-week-${week.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              handleOpenDayForm(week.id);
                            }}
                            data-testid={`button-add-day-${week.id}`}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Day
                          </Button>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 space-y-4">
                        {days.length === 0 ? (
                          <p className="text-sm text-muted-foreground py-2">
                            No days. Add Day 1, Day 2, Optional Running Day, etc.
                          </p>
                        ) : (
                          days.map((day) => {
                            const exercises = exercisesByDay[day.id] ?? [];
                            return (
                              <div
                                key={day.id}
                                className="border rounded-lg p-4 space-y-2"
                                data-testid={`day-block-${day.id}`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-sm">
                                    {day.label}
                                  </span>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleOpenDayForm(week.id, day)
                                      }
                                      data-testid={`button-edit-day-${day.id}`}
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        if (confirm(`Delete ${day.label}?`))
                                          deleteDayMutation.mutate(day.id);
                                      }}
                                      className="text-red-600"
                                      data-testid={`button-delete-day-${day.id}`}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleOpenExerciseForm(day.id)
                                      }
                                      data-testid={`button-add-exercise-${day.id}`}
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Exercise
                                    </Button>
                                  </div>
                                </div>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Exercise</TableHead>
                                      <TableHead># of Sets</TableHead>
                                      <TableHead># of Reps</TableHead>
                                      <TableHead className="w-24" />
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {exercises.length === 0 ? (
                                      <TableRow>
                                        <TableCell
                                          colSpan={4}
                                          className="text-muted-foreground text-sm"
                                        >
                                          No exercises. Add one.
                                        </TableCell>
                                      </TableRow>
                                    ) : (
                                      exercises.map((ex) => (
                                        <TableRow
                                          key={ex.id}
                                          data-testid={`exercise-row-${ex.id}`}
                                        >
                                          <TableCell className="font-medium">
                                            {ex.exerciseName}
                                          </TableCell>
                                          <TableCell>{ex.sets}</TableCell>
                                          <TableCell>{ex.reps}</TableCell>
                                          <TableCell>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() =>
                                                handleOpenExerciseForm(
                                                  day.id,
                                                  ex,
                                                )
                                              }
                                            >
                                              <Edit className="h-3 w-3" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="text-red-600"
                                              onClick={() => {
                                                if (
                                                  confirm(
                                                    `Delete ${ex.exerciseName}?`,
                                                  )
                                                )
                                                  deleteExerciseMutation.mutate(
                                                    ex.id,
                                                  );
                                              }}
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </TableCell>
                                        </TableRow>
                                      ))
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                            );
                          })
                        )}
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })
          )}
        </div>

        {/* Plan dialog */}
        <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? "Edit Plan" : "Add Workout Plan"}
              </DialogTitle>
              <DialogDescription>
                e.g. &quot;8-10 yr old&quot; or &quot;11-13 yr old&quot;. Plan
                can be weekly or monthly.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={planForm.name}
                  onChange={(e) =>
                    setPlanForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="8-10 yr old"
                  data-testid="input-plan-name"
                />
              </div>
              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Textarea
                  value={planForm.description}
                  onChange={(e) =>
                    setPlanForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Age group or phase description"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Period</Label>
                <Select
                  value={planForm.periodType}
                  onValueChange={(v: "week" | "month") =>
                    setPlanForm((f) => ({ ...f, periodType: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSavePlan}
                disabled={
                  createPlanMutation.isPending || updatePlanMutation.isPending
                }
                data-testid="button-save-plan"
              >
                {editingPlan ? "Save" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Week dialog */}
        <Dialog open={weekDialogOpen} onOpenChange={setWeekDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingWeek ? "Edit Week" : "Add Week"}
              </DialogTitle>
              <DialogDescription>
                e.g. Week 1, Week 5, Week 9
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  value={weekForm.label}
                  onChange={(e) =>
                    setWeekForm((f) => ({ ...f, label: e.target.value }))
                  }
                  placeholder="Week 1"
                  data-testid="input-week-label"
                />
              </div>
              <div className="space-y-2">
                <Label>Sort order</Label>
                <Input
                  type="number"
                  min={0}
                  value={weekForm.sortOrder}
                  onChange={(e) =>
                    setWeekForm((f) => ({
                      ...f,
                      sortOrder: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setWeekDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveWeek}
                disabled={
                  createWeekMutation.isPending || updateWeekMutation.isPending
                }
                data-testid="button-save-week"
              >
                {editingWeek ? "Save" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Day dialog */}
        <Dialog open={dayDialogOpen} onOpenChange={setDayDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDay ? "Edit Day" : "Add Day"}
              </DialogTitle>
              <DialogDescription>
                e.g. Day 1, Day 2, Day 3, Optional Running Day
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  value={dayForm.label}
                  onChange={(e) =>
                    setDayForm((f) => ({ ...f, label: e.target.value }))
                  }
                  placeholder="Day 1"
                  data-testid="input-day-label"
                />
              </div>
              <div className="space-y-2">
                <Label>Sort order</Label>
                <Input
                  type="number"
                  min={0}
                  value={dayForm.sortOrder}
                  onChange={(e) =>
                    setDayForm((f) => ({
                      ...f,
                      sortOrder: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDayDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveDay}
                disabled={
                  createDayMutation.isPending || updateDayMutation.isPending
                }
                data-testid="button-save-day"
              >
                {editingDay ? "Save" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Exercise dialog */}
        <Dialog
          open={exerciseDialogOpen}
          onOpenChange={setExerciseDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingExercise ? "Edit Exercise" : "Add Exercise"}
              </DialogTitle>
              <DialogDescription>
                Sets can be a number (e.g. 2) or &quot;1- Singles&quot;. Reps
                can be &quot;30 seconds&quot;, &quot;To Failure&quot;, &quot;6-8&quot;,
                &quot;10 yds&quot;, etc.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Exercise name</Label>
                <Input
                  value={exerciseForm.exerciseName}
                  onChange={(e) =>
                    setExerciseForm((f) => ({
                      ...f,
                      exerciseName: e.target.value,
                    }))
                  }
                  placeholder="Jump Rope"
                  data-testid="input-exercise-name"
                />
              </div>
              <div className="space-y-2">
                <Label># of Sets</Label>
                <Input
                  value={exerciseForm.sets}
                  onChange={(e) =>
                    setExerciseForm((f) => ({ ...f, sets: e.target.value }))
                  }
                  placeholder="1 or 2"
                  data-testid="input-exercise-sets"
                />
              </div>
              <div className="space-y-2">
                <Label># of Reps / Distance / Time</Label>
                <Input
                  value={exerciseForm.reps}
                  onChange={(e) =>
                    setExerciseForm((f) => ({ ...f, reps: e.target.value }))
                  }
                  placeholder="30 seconds, To Failure, 6-8, 10 yds"
                  data-testid="input-exercise-reps"
                />
              </div>
              <div className="space-y-2">
                <Label>Sort order</Label>
                <Input
                  type="number"
                  min={0}
                  value={exerciseForm.sortOrder}
                  onChange={(e) =>
                    setExerciseForm((f) => ({
                      ...f,
                      sortOrder: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setExerciseDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveExercise}
                disabled={
                  createExerciseMutation.isPending ||
                  updateExerciseMutation.isPending
                }
                data-testid="button-save-exercise"
              >
                {editingExercise ? "Save" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">
          Workout Plans (Week / Month)
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create plans by age group or phase (e.g. 8-10 yr old). Each plan has
          weeks, days, and exercises with sets/reps.
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => handleOpenPlanForm()}
          data-testid="button-add-plan"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Plan
        </Button>
      </div>

      {plansLoading ? (
        <p className="text-muted-foreground py-8">Loading plans...</p>
      ) : plans.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">
          No plans yet. Click &quot;Add Plan&quot; to create one (e.g. 8-10 yr
          old).
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setSelectedPlan(plan)}
              data-testid={`plan-card-${plan.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium" data-testid={`text-plan-name-${plan.id}`}>
                      {plan.name}
                    </h3>
                    {plan.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {plan.description}
                      </p>
                    )}
                    <Badge variant="secondary" className="mt-2">
                      {plan.periodType === "month" ? "Monthly" : "Weekly"}
                    </Badge>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                </div>
                <div className="mt-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPlanForm(plan);
                    }}
                    data-testid={`button-edit-plan-${plan.id}`}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        confirm(
                          `Delete "${plan.name}"? This will remove all weeks, days and exercises.`,
                        )
                      )
                        deletePlanMutation.mutate(plan.id);
                    }}
                    data-testid={`button-delete-plan-${plan.id}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Plan dialog (for create from list view) */}
      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? "Edit Plan" : "Add Workout Plan"}
            </DialogTitle>
            <DialogDescription>
              e.g. &quot;8-10 yr old&quot;. Plan can be weekly or monthly.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={planForm.name}
                onChange={(e) =>
                  setPlanForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="8-10 yr old"
                data-testid="input-plan-name"
              />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea
                value={planForm.description}
                onChange={(e) =>
                  setPlanForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Age group or phase description"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Period</Label>
              <Select
                value={planForm.periodType}
                onValueChange={(v: "week" | "month") =>
                  setPlanForm((f) => ({ ...f, periodType: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSavePlan}
              disabled={
                createPlanMutation.isPending || updatePlanMutation.isPending
              }
              data-testid="button-save-plan"
            >
              {editingPlan ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
