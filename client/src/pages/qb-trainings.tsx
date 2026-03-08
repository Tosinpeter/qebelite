import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  qbTrainingCategoryQueries,
  qbTrainingQueries,
} from "@/lib/supabase-queries";
import { getVideoThumbnail } from "@/lib/video-thumbnail";
import { useToast } from "@/hooks/use-toast";
import type {
  QbTrainingCategory,
  QbTraining,
} from "@shared/schema";

const itemsPerPage = 9;

export default function QbTrainings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("categories");
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isTrainingDialogOpen, setIsTrainingDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<QbTrainingCategory | null>(null);
  const [editingTraining, setEditingTraining] = useState<QbTraining | null>(
    null,
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [trainingsPage, setTrainingsPage] = useState(1);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    sortOrder: 0,
  });
  const [trainingForm, setTrainingForm] = useState({
    weekOfRelease: "",
    categoryId: "",
    title: "",
    videoLink: "",
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    QbTrainingCategory[]
  >({
    queryKey: ["qb-training-categories"],
    queryFn: qbTrainingCategoryQueries.getAll,
  });

  const { data: trainings = [], isLoading: trainingsLoading } = useQuery<
    QbTraining[]
  >({
    queryKey: ["qb-trainings"],
    queryFn: qbTrainingQueries.getAll,
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data: Partial<QbTrainingCategory>) =>
      qbTrainingCategoryQueries.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qb-training-categories"] });
      toast({ title: "Category created successfully" });
      setIsCategoryDialogOpen(false);
    },
    onError: (e: unknown) => {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to create",
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<QbTrainingCategory>;
    }) => qbTrainingCategoryQueries.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qb-training-categories"] });
      toast({ title: "Category updated successfully" });
      setIsCategoryDialogOpen(false);
    },
    onError: (e: unknown) => {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to update",
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => qbTrainingCategoryQueries.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qb-training-categories"] });
      queryClient.invalidateQueries({ queryKey: ["qb-trainings"] });
      toast({ title: "Category deleted successfully" });
    },
    onError: (e: unknown) => {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to delete",
        variant: "destructive",
      });
    },
  });

  const createTrainingMutation = useMutation({
    mutationFn: (data: Partial<QbTraining>) => qbTrainingQueries.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qb-trainings"] });
      toast({ title: "Training created successfully" });
      setIsTrainingDialogOpen(false);
    },
    onError: (e: unknown) => {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to create",
        variant: "destructive",
      });
    },
  });

  const updateTrainingMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: { id: string; data: Partial<QbTraining> }) =>
      qbTrainingQueries.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qb-trainings"] });
      toast({ title: "Training updated successfully" });
      setIsTrainingDialogOpen(false);
    },
    onError: (e: unknown) => {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to update",
        variant: "destructive",
      });
    },
  });

  const deleteTrainingMutation = useMutation({
    mutationFn: (id: string) => qbTrainingQueries.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qb-trainings"] });
      toast({ title: "Training deleted successfully" });
    },
    onError: (e: unknown) => {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to delete",
        variant: "destructive",
      });
    },
  });

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: "", sortOrder: categories.length });
    setIsCategoryDialogOpen(true);
  };

  const handleEditCategory = (cat: QbTrainingCategory) => {
    setEditingCategory(cat);
    setCategoryForm({ name: cat.name, sortOrder: cat.sortOrder });
    setIsCategoryDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name.trim()) {
      toast({
        variant: "destructive",
        title: "Name is required",
      });
      return;
    }
    if (editingCategory) {
      updateCategoryMutation.mutate({
        id: editingCategory.id,
        data: categoryForm,
      });
    } else {
      createCategoryMutation.mutate(categoryForm);
    }
  };

  const handleDeleteCategory = (cat: QbTrainingCategory) => {
    if (
      confirm(
        `Delete "${cat.name}"? Trainings in this category will also be deleted.`,
      )
    ) {
      deleteCategoryMutation.mutate(cat.id);
    }
  };

  const handleCreateTraining = () => {
    setEditingTraining(null);
    setTrainingForm({
      weekOfRelease: "",
      categoryId:
        selectedCategoryId !== "all" ? selectedCategoryId : categories[0]?.id ?? "",
      title: "",
      videoLink: "",
    });
    setIsTrainingDialogOpen(true);
  };

  const handleEditTraining = (t: QbTraining) => {
    setEditingTraining(t);
    setTrainingForm({
      weekOfRelease: t.weekOfRelease,
      categoryId: t.categoryId,
      title: t.title,
      videoLink: t.videoLink,
    });
    setIsTrainingDialogOpen(true);
  };

  const handleSaveTraining = () => {
    if (!trainingForm.title.trim()) {
      toast({ variant: "destructive", title: "Title is required" });
      return;
    }
    if (!trainingForm.weekOfRelease.trim()) {
      toast({ variant: "destructive", title: "Week of Release is required" });
      return;
    }
    if (!trainingForm.categoryId) {
      toast({ variant: "destructive", title: "Category is required" });
      return;
    }
    if (!trainingForm.videoLink.trim()) {
      toast({ variant: "destructive", title: "Video link is required" });
      return;
    }
    if (editingTraining) {
      updateTrainingMutation.mutate({
        id: editingTraining.id,
        data: trainingForm,
      });
    } else {
      createTrainingMutation.mutate(trainingForm);
    }
  };

  const handleDeleteTraining = (t: QbTraining) => {
    if (confirm(`Delete "${t.title}"?`)) {
      deleteTrainingMutation.mutate(t.id);
    }
  };

  const filteredTrainings =
    selectedCategoryId === "all"
      ? trainings
      : trainings.filter((t) => t.categoryId === selectedCategoryId);

  const totalCategoryPages = Math.ceil(categories.length / itemsPerPage);
  const totalTrainingPages = Math.ceil(filteredTrainings.length / itemsPerPage);
  const paginatedCategories = categories.slice(
    (categoriesPage - 1) * itemsPerPage,
    categoriesPage * itemsPerPage,
  );
  const paginatedTrainings = filteredTrainings.slice(
    (trainingsPage - 1) * itemsPerPage,
    trainingsPage * itemsPerPage,
  );

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">
          QB Trainings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage categories and training videos (week of release, category,
          title, Vimeo video link)
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList data-testid="tabs-qb-trainings">
          <TabsTrigger value="categories" data-testid="tab-categories">
            Categories
          </TabsTrigger>
          <TabsTrigger value="trainings" data-testid="tab-trainings">
            Trainings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4 mt-6">
          <div className="flex justify-end">
            <Button
              onClick={handleCreateCategory}
              data-testid="button-create-category"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          {categoriesLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">
                No categories yet. Add one to use for trainings.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {paginatedCategories.map((cat) => (
                  <Card
                    key={cat.id}
                    className="hover-elevate"
                    data-testid={`category-item-${cat.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="font-medium" data-testid={`text-category-name-${cat.id}`}>
                        {cat.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Order: {cat.sortOrder}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleEditCategory(cat)}
                          data-testid={`button-edit-category-${cat.id}`}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteCategory(cat)}
                          data-testid={`button-delete-category-${cat.id}`}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {totalCategoryPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCategoriesPage((p) => Math.max(1, p - 1))
                        }
                        className={
                          categoriesPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {Array.from(
                      { length: totalCategoryPages },
                      (_, i) => i + 1,
                    ).map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          onClick={() => setCategoriesPage(p)}
                          isActive={categoriesPage === p}
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCategoriesPage((p) =>
                            Math.min(totalCategoryPages, p + 1),
                          )
                        }
                        className={
                          categoriesPage === totalCategoryPages
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
        </TabsContent>

        <TabsContent value="trainings" className="space-y-4 mt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium">
                Filter by Category:
              </Label>
              <Select
                value={selectedCategoryId}
                onValueChange={(v) => {
                  setSelectedCategoryId(v);
                  setTrainingsPage(1);
                }}
              >
                <SelectTrigger className="w-64" data-testid="select-category-filter">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleCreateTraining}
              disabled={categories.length === 0}
              data-testid="button-add-training"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Training
            </Button>
          </div>

          {trainingsLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading trainings...</p>
            </div>
          ) : filteredTrainings.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">
                No trainings found.
                {categories.length === 0
                  ? " Add a category first, then add trainings."
                  : ""}
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {paginatedTrainings.map((t) => {
                  const thumb = getVideoThumbnail(t.videoLink);
                  return (
                    <Card
                      key={t.id}
                      className="hover-elevate"
                      data-testid={`training-item-${t.id}`}
                    >
                      <CardHeader className="p-0">
                        <div className="aspect-video bg-muted rounded-t-md flex items-center justify-center relative overflow-hidden">
                          {thumb ? (
                            <>
                              <img
                                src={thumb}
                                alt={t.title}
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
                        <div className="space-y-1">
                          <div
                            className="font-medium text-sm"
                            data-testid={`text-training-title-${t.id}`}
                          >
                            {t.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Week of release: {t.weekOfRelease}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Category: {getCategoryName(t.categoryId)}
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => window.open(t.videoLink, "_blank")}
                            data-testid={`button-watch-${t.id}`}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Watch
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditTraining(t)}
                            data-testid={`button-edit-training-${t.id}`}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTraining(t)}
                            data-testid={`button-delete-training-${t.id}`}
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
              {totalTrainingPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setTrainingsPage((p) => Math.max(1, p - 1))
                        }
                        className={
                          trainingsPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {Array.from(
                      { length: totalTrainingPages },
                      (_, i) => i + 1,
                    ).map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          onClick={() => setTrainingsPage(p)}
                          isActive={trainingsPage === p}
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setTrainingsPage((p) =>
                            Math.min(totalTrainingPages, p + 1),
                          )
                        }
                        className={
                          trainingsPage === totalTrainingPages
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
        </TabsContent>
      </Tabs>

      {/* Category dialog */}
      <Dialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
      >
        <DialogContent data-testid="dialog-category-form">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update category name and order"
                : "Add a category for QB trainings"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                placeholder="e.g. Fundamentals"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm((f) => ({ ...f, name: e.target.value }))
                }
                data-testid="input-category-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-sort">Sort Order</Label>
              <Input
                id="category-sort"
                type="number"
                min={0}
                value={categoryForm.sortOrder}
                onChange={(e) =>
                  setCategoryForm((f) => ({
                    ...f,
                    sortOrder: parseInt(e.target.value, 10) || 0,
                  }))
                }
                data-testid="input-category-sort"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCategory}
              disabled={
                createCategoryMutation.isPending ||
                updateCategoryMutation.isPending
              }
              data-testid="button-save-category"
            >
              {createCategoryMutation.isPending || updateCategoryMutation.isPending
                ? "Saving..."
                : editingCategory
                  ? "Save Changes"
                  : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Training dialog */}
      <Dialog
        open={isTrainingDialogOpen}
        onOpenChange={setIsTrainingDialogOpen}
      >
        <DialogContent data-testid="dialog-training-form">
          <DialogHeader>
            <DialogTitle>
              {editingTraining ? "Edit Training" : "Add Training"}
            </DialogTitle>
            <DialogDescription>
              {editingTraining
                ? "Update week of release, category, title and video link"
                : "Add a QB training video"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="training-week">Week of Release</Label>
              <Input
                id="training-week"
                placeholder="e.g. Week 1 or 2025-01-06"
                value={trainingForm.weekOfRelease}
                onChange={(e) =>
                  setTrainingForm((f) => ({
                    ...f,
                    weekOfRelease: e.target.value,
                  }))
                }
                data-testid="input-training-week"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="training-category">Category</Label>
              <Select
                value={trainingForm.categoryId}
                onValueChange={(v) =>
                  setTrainingForm((f) => ({ ...f, categoryId: v }))
                }
              >
                <SelectTrigger id="training-category" data-testid="select-training-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="training-title">Title</Label>
              <Input
                id="training-title"
                placeholder="Training title"
                value={trainingForm.title}
                onChange={(e) =>
                  setTrainingForm((f) => ({ ...f, title: e.target.value }))
                }
                data-testid="input-training-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="training-video">Video Link</Label>
              <Input
                id="training-video"
                type="url"
                placeholder="https://vimeo.com/... or https://player.vimeo.com/video/..."
                value={trainingForm.videoLink}
                onChange={(e) =>
                  setTrainingForm((f) => ({ ...f, videoLink: e.target.value }))
                }
                data-testid="input-training-video"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTrainingDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveTraining}
              disabled={
                createTrainingMutation.isPending ||
                updateTrainingMutation.isPending
              }
              data-testid="button-save-training"
            >
              {createTrainingMutation.isPending || updateTrainingMutation.isPending
                ? "Saving..."
                : editingTraining
                  ? "Save Changes"
                  : "Add Training"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
