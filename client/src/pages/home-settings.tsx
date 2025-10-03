import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GripVertical, Eye, EyeOff, Plus, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { HomeBanner, HomeWidget } from "@shared/schema";

export default function HomeSettings() {
  const { toast } = useToast();
  
  const { data: widgets = [], isLoading: widgetsLoading } = useQuery<HomeWidget[]>({
    queryKey: ["/api/home-widgets"],
  });

  const { data: banners = [], isLoading: bannersLoading } = useQuery<HomeBanner[]>({
    queryKey: ["/api/home-banners"],
  });

  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HomeBanner | null>(null);
  const [bannerForm, setBannerForm] = useState({
    position: 0,
    imageUrl: "",
    redirectUrl: "",
  });

  const createBannerMutation = useMutation({
    mutationFn: (data: { position: number; imageUrl: string; redirectUrl: string }) =>
      apiRequest("POST", "/api/home-banners", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/home-banners"] });
      toast({ title: "Banner created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateBannerMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HomeBanner> }) =>
      apiRequest("PATCH", `/api/home-banners/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/home-banners"] });
      toast({ title: "Banner updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteBannerMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/home-banners/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/home-banners"] });
      toast({ title: "Banner deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateWidgetMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HomeWidget> }) =>
      apiRequest("PATCH", `/api/home-widgets/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/home-widgets"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const [draggedItem, setDraggedItem] = useState<HomeWidget | null>(null);

  const handleDragStart = (widget: HomeWidget) => {
    setDraggedItem(widget);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetWidget: HomeWidget) => {
    if (!draggedItem || draggedItem.id === targetWidget.id) return;

    const newWidgets = [...widgets];
    const draggedIndex = newWidgets.findIndex(w => w.id === draggedItem.id);
    const targetIndex = newWidgets.findIndex(w => w.id === targetWidget.id);

    newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(targetIndex, 0, draggedItem);

    for (let i = 0; i < newWidgets.length; i++) {
      if (newWidgets[i].position !== i) {
        await updateWidgetMutation.mutateAsync({ 
          id: newWidgets[i].id, 
          data: { position: i } 
        });
      }
    }
    
    setDraggedItem(null);
  };

  const toggleVisibility = (widget: HomeWidget) => {
    updateWidgetMutation.mutate({ 
      id: widget.id, 
      data: { visible: !widget.visible } 
    });
  };

  const handleCreateBanner = () => {
    setEditingBanner(null);
    setBannerForm({ position: banners.length, imageUrl: "", redirectUrl: "" });
    setIsBannerDialogOpen(true);
  };

  const handleEditBanner = (banner: HomeBanner) => {
    setEditingBanner(banner);
    setBannerForm({
      position: banner.position,
      imageUrl: banner.imageUrl,
      redirectUrl: banner.redirectUrl,
    });
    setIsBannerDialogOpen(true);
  };

  const handleDeleteBanner = (id: string) => {
    deleteBannerMutation.mutate(id);
  };

  const handleSaveBanner = () => {
    if (editingBanner) {
      updateBannerMutation.mutate(
        { id: editingBanner.id, data: bannerForm },
        { onSuccess: () => setIsBannerDialogOpen(false) }
      );
    } else {
      createBannerMutation.mutate(bannerForm, {
        onSuccess: () => setIsBannerDialogOpen(false),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-page-title">Home Layout Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage home page banners and widget layout
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Home Banners</CardTitle>
            <Button onClick={handleCreateBanner} data-testid="button-create-banner">
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {banners.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No banners configured. Click "Add Banner" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3">Position</th>
                    <th className="px-6 py-3">Image URL</th>
                    <th className="px-6 py-3">Redirect URL</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {banners.sort((a, b) => a.position - b.position).map((banner) => (
                    <tr
                      key={banner.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      data-testid={`banner-row-${banner.id}`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {banner.position}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {banner.imageUrl}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {banner.redirectUrl}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditBanner(banner)}
                            data-testid={`button-edit-banner-${banner.id}`}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBanner(banner.id)}
                            data-testid={`button-delete-banner-${banner.id}`}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Widget Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Drag widgets to reorder them. Toggle visibility with the eye icon.
            </p>
            <div className="space-y-2">
              {widgets.map((widget) => (
                <div
                  key={widget.id}
                  draggable
                  onDragStart={() => handleDragStart(widget)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(widget)}
                  className={`flex items-center gap-3 p-4 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-700 cursor-move transition-colors ${
                    !widget.visible ? "opacity-50" : ""
                  }`}
                  data-testid={`widget-item-${widget.id}`}
                >
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{widget.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Position {widget.position + 1}</div>
                  </div>
                  <Badge variant="secondary">{widget.type}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleVisibility(widget)}
                    data-testid={`button-toggle-${widget.id}`}
                  >
                    {widget.visible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              This is how the home page will appear to users
            </p>
            <div className="space-y-3 bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
              {widgets
                .filter(w => w.visible)
                .sort((a, b) => a.position - b.position)
                .map((widget) => (
                  <div
                    key={widget.id}
                    className="p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm"
                    data-testid={`preview-widget-${widget.id}`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{widget.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {widget.type} widget
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
        <DialogContent data-testid="dialog-banner-form">
          <DialogHeader>
            <DialogTitle>{editingBanner ? "Edit Banner" : "Create New Banner"}</DialogTitle>
            <DialogDescription>
              {editingBanner ? "Update banner details" : "Add a new banner to the home page"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                type="number"
                min="0"
                placeholder="0"
                value={bannerForm.position}
                onChange={(e) => setBannerForm({ ...bannerForm, position: parseInt(e.target.value) || 0 })}
                data-testid="input-banner-position"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/banner.jpg"
                value={bannerForm.imageUrl}
                onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                data-testid="input-banner-image"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="redirectUrl">Redirect URL</Label>
              <Input
                id="redirectUrl"
                type="url"
                placeholder="https://example.com/destination"
                value={bannerForm.redirectUrl}
                onChange={(e) => setBannerForm({ ...bannerForm, redirectUrl: e.target.value })}
                data-testid="input-banner-redirect"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBannerDialogOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button onClick={handleSaveBanner} data-testid="button-save-banner">
              {editingBanner ? "Save Changes" : "Create Banner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
