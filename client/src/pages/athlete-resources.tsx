import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, ExternalLink, Upload, BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { athleteResourceQueries, storageHelpers } from "@/lib/supabase-queries";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { AthleteResource } from "@shared/schema";

export default function AthleteResources() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<AthleteResource | null>(null);
  const [deleteResource, setDeleteResource] = useState<AthleteResource | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    externalUrl: "",
    position: 0,
  });

  const { toast } = useToast();

  const { data: resources, isLoading } = useQuery({
    queryKey: ['/athlete-resources'],
    queryFn: () => athleteResourceQueries.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<AthleteResource>) => athleteResourceQueries.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/athlete-resources'] });
      toast({
        title: "Success",
        description: "Resource created successfully",
      });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create resource",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AthleteResource> }) =>
      athleteResourceQueries.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/athlete-resources'] });
      toast({
        title: "Success",
        description: "Resource updated successfully",
      });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update resource",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => athleteResourceQueries.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/athlete-resources'] });
      toast({
        title: "Success",
        description: "Resource deleted successfully",
      });
      setDeleteResource(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete resource",
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = (resource?: AthleteResource) => {
    if (resource) {
      setEditingResource(resource);
      setFormData({
        title: resource.title,
        description: resource.description,
        image: resource.image,
        externalUrl: resource.externalUrl,
        position: resource.position,
      });
      if (resource.image) {
        setImagePreview(resource.image);
      }
    } else {
      setEditingResource(null);
      const nextPosition = resources ? resources.length : 0;
      setFormData({
        title: "",
        description: "",
        image: "",
        externalUrl: "",
        position: nextPosition,
      });
    }
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingResource(null);
    setImageFile(null);
    setImagePreview("");
    setFormData({
      title: "",
      description: "",
      image: "",
      externalUrl: "",
      position: 0,
    });
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData(prev => ({ ...prev, image: "" }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.externalUrl.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (title, description, external URL)",
        variant: "destructive",
      });
      return;
    }

    let imageUrl = formData.image;

    if (!imageFile && !imageUrl.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide an image (upload or URL)",
        variant: "destructive",
      });
      return;
    }

    if (imageFile) {
      try {
        setIsUploadingImage(true);
        const fileExt = imageFile.name.split('.').pop();
        const sanitizedFileName = imageFile.name
          .replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9.-]/g, '');
        const fileName = `${Date.now()}-${sanitizedFileName}`;
        const filePath = `athlete-resources/${fileName}`;

        await storageHelpers.uploadFile('recipe-images', filePath, imageFile);
        imageUrl = storageHelpers.getPublicUrl('recipe-images', filePath);
      } catch (error: any) {
        if (error.message?.includes('Bucket not found')) {
          toast({
            title: "Storage Setup Required",
            description: "The recipe-images bucket is used for athlete resource images. Please create it in Supabase Dashboard: Storage → New Bucket → Name: recipe-images (make it public).",
            variant: "destructive",
            duration: 10000,
          });
        } else {
          toast({
            title: "Upload Failed",
            description: error.message || "Failed to upload image",
            variant: "destructive",
          });
        }
        setIsUploadingImage(false);
        return;
      } finally {
        setIsUploadingImage(false);
      }
    }

    const resourceData: Partial<AthleteResource> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      image: imageUrl,
      externalUrl: formData.externalUrl.trim(),
      position: formData.position,
    };

    if (editingResource) {
      updateMutation.mutate({ id: editingResource.id, data: resourceData });
    } else {
      createMutation.mutate(resourceData);
    }
  };

  const handleDelete = () => {
    if (deleteResource) {
      deleteMutation.mutate(deleteResource.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Athlete Resources</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage external resources and links for athletes
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-create-resource">
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (resources && resources.length > 0) ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Card key={resource.id} className="overflow-hidden hover-elevate" data-testid={`resource-item-${resource.id}`}>
              {resource.image ? (
                <div className="h-48 w-full overflow-hidden bg-muted">
                  <img 
                    src={resource.image} 
                    alt={resource.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full w-full bg-muted"><svg class="h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div>';
                    }}
                  />
                </div>
              ) : (
                <div className="h-48 w-full bg-muted flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.open(resource.externalUrl, '_blank')}
                    data-testid={`button-open-resource-${resource.id}`}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open Link
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleOpenDialog(resource)}
                    data-testid={`button-edit-resource-${resource.id}`}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setDeleteResource(resource)}
                    data-testid={`button-delete-resource-${resource.id}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-semibold mb-1">No resources yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Add your first athlete resource to get started</p>
          <Button onClick={() => handleOpenDialog()} data-testid="button-create-first-resource">
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl" data-testid="dialog-resource-form">
          <DialogHeader>
            <DialogTitle>{editingResource ? "Edit Resource" : "Add Athlete Resource"}</DialogTitle>
            <DialogDescription>
              {editingResource ? "Update the resource details" : "Add a new resource with image, description, and external link"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title" 
                placeholder="e.g., Training Guide, Nutrition Handbook" 
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                data-testid="input-resource-title" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea 
                id="description" 
                placeholder="Brief description of this resource" 
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                data-testid="input-resource-description" 
              />
            </div>

            <div className="space-y-2">
              <Label>Image</Label>
              
              {imagePreview ? (
                <div className="relative w-full h-48 mx-auto">
                  <div className="h-48 w-full rounded-md overflow-hidden border bg-muted flex items-center justify-center">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438';
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8 rounded-md p-0"
                    onClick={handleRemoveImage}
                    data-testid="button-remove-image"
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-3">Upload an image or paste a URL</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => document.getElementById('image-file-input')?.click()}
                    data-testid="button-upload-image"
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Upload
                  </Button>
                  <input
                    id="image-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                    data-testid="input-image-file"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="external-url">External URL *</Label>
              <Input 
                id="external-url" 
                placeholder="https://..." 
                value={formData.externalUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, externalUrl: e.target.value }))}
                data-testid="input-resource-url" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Display Order</Label>
              <Input 
                id="position" 
                type="number"
                placeholder="0" 
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: parseInt(e.target.value) || 0 }))}
                data-testid="input-resource-position" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} data-testid="button-cancel">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={createMutation.isPending || updateMutation.isPending || isUploadingImage}
              data-testid="button-save-resource"
            >
              {isUploadingImage ? "Uploading..." : (createMutation.isPending || updateMutation.isPending ? "Saving..." : (editingResource ? "Update" : "Create"))}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteResource} onOpenChange={() => setDeleteResource(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteResource?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
