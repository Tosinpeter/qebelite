import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Edit, Trash2 } from "lucide-react";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { workoutQueries } from "@/lib/supabase-queries";
import { getVideoThumbnail } from "@/lib/video-thumbnail";
import { useToast } from "@/hooks/use-toast";
import type { Workout } from "@shared/schema";

function parseCollectionInput(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatCollectionForInput(items: string[] | null | undefined): string {
  if (!items || items.length === 0) return "";
  return items.join("\n");
}

export default function WorkoutManagement() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;
  const [formData, setFormData] = useState({
    name: "",
    collectionInput: "",
    description: "",
    videoUrl: "",
  });

  const { data: workouts = [], isLoading } = useQuery<Workout[]>({
    queryKey: ["workouts"],
    queryFn: workoutQueries.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Workout>) => workoutQueries.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      toast({ title: "Workout created successfully" });
      setIsDialogOpen(false);
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Workout> }) =>
      workoutQueries.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      toast({ title: "Workout updated successfully" });
      setIsDialogOpen(false);
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => workoutQueries.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      toast({ title: "Workout deleted successfully" });
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete",
        variant: "destructive",
      });
    },
  });

  const handleCreate = () => {
    setEditingWorkout(null);
    setFormData({
      name: "",
      collectionInput: "",
      description: "",
      videoUrl: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout);
    setFormData({
      name: workout.name,
      collectionInput: formatCollectionForInput(workout.collection),
      description: workout.description ?? "",
      videoUrl: workout.videoUrl,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (workout: Workout) => {
    if (confirm(`Are you sure you want to delete "${workout.name}"?`)) {
      deleteMutation.mutate(workout.id);
    }
  };

  const handleSave = () => {
    const collection = parseCollectionInput(formData.collectionInput);
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Missing required field",
        description: "Name is required",
      });
      return;
    }
    if (!formData.videoUrl.trim()) {
      toast({
        variant: "destructive",
        title: "Missing required field",
        description: "Video URL is required",
      });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      collection: collection.length > 0 ? collection : undefined,
      description: formData.description.trim() || undefined,
      videoUrl: formData.videoUrl.trim(),
    };

    if (editingWorkout) {
      updateMutation.mutate({ id: editingWorkout.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const totalPages = Math.ceil(workouts.length / itemsPerPage);
  const paginated = workouts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">
          Workouts
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage workout entries with name, collection tags, description and video
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleCreate} data-testid="button-create-workout">
          <Plus className="h-4 w-4 mr-2" />
          Add Workout
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading workouts...</p>
        </div>
      ) : workouts.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">
            No workouts yet. Click &quot;Add Workout&quot; to create one.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginated.map((workout) => {
              const thumbnail = getVideoThumbnail(workout.videoUrl);
              return (
                <Card
                  key={workout.id}
                  className="hover-elevate"
                  data-testid={`workout-item-${workout.id}`}
                >
                  <CardHeader className="p-0">
                    <div className="aspect-video bg-muted rounded-t-md flex items-center justify-center relative overflow-hidden">
                      {thumbnail ? (
                        <>
                          <img
                            src={thumbnail}
                            alt={workout.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Play className="h-16 w-16 text-white drop-shadow-lg" />
                          </div>
                        </>
                      ) : (
                        <Play className="h-12 w-12 text-primary" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div
                        className="font-medium text-sm"
                        data-testid={`text-workout-name-${workout.id}`}
                      >
                        {workout.name}
                      </div>
                      {workout.collection && workout.collection.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {workout.collection.map((item, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs"
                            >
                              {item}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {workout.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {workout.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => window.open(workout.videoUrl, "_blank")}
                        data-testid={`button-watch-${workout.id}`}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Watch
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(workout)}
                        data-testid={`button-edit-workout-${workout.id}`}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(workout)}
                        data-testid={`button-delete-workout-${workout.id}`}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={
                      page === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        onClick={() => setPage(p)}
                        isActive={page === p}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent data-testid="dialog-workout-form">
          <DialogHeader>
            <DialogTitle>
              {editingWorkout ? "Edit Workout" : "Add Workout"}
            </DialogTitle>
            <DialogDescription>
              {editingWorkout
                ? "Update workout details"
                : "Add a new workout with name, collection tags, description and video URL"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workout-name">Name</Label>
              <Input
                id="workout-name"
                placeholder="Workout name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                data-testid="input-workout-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workout-collection">Collection (one per line or comma-separated)</Label>
              <Textarea
                id="workout-collection"
                placeholder="e.g. Strength&#10;Cardio&#10;HIIT"
                value={formData.collectionInput}
                onChange={(e) =>
                  setFormData({ ...formData, collectionInput: e.target.value })
                }
                data-testid="input-workout-collection"
                rows={3}
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workout-description">Description</Label>
              <Textarea
                id="workout-description"
                placeholder="Optional description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                data-testid="input-workout-description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workout-video-url">Video URL</Label>
              <Input
                id="workout-video-url"
                type="url"
                placeholder="https://vimeo.com/... or https://player.vimeo.com/video/..."
                value={formData.videoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, videoUrl: e.target.value })
                }
                data-testid="input-workout-video-url"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              data-testid="button-cancel-workout"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-save-workout"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : editingWorkout
                  ? "Save Changes"
                  : "Add Workout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
