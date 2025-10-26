import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { HomeSlide, HomeWidget, HomeWidgetItem } from "@shared/schema";
import { supabase } from "@/lib/supabase";
import { homeSlideQueries, homeWidgetItemQueries } from "@/lib/supabase-queries";
import { Upload, X, ImageIcon, CheckCircle2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";

// Flutter App Routes
const FLUTTER_ROUTES = [
  { value: '/huddle', label: 'Huddle Screen' },
  { value: '/nutrition', label: 'Nutrition Screen' },
  { value: '/weight-room', label: 'Weight Room Screen' },
  { value: '/plannedMealScreen', label: 'Planned Meal Screen' },
  { value: '/notificationScreen', label: 'Notification Screen' },
  { value: '/weightRoomCollectionScreen', label: 'Weight Room Collection Screen' },
  { value: '/athleteResourcesScreen', label: 'Athlete Resources Screen' },
  { value: '/scheduleCoachingScreen', label: 'Schedule Coaching Screen' },
];

interface WidgetImageDropzoneProps {
  value: string;
  onChange: (url: string) => void;
  onUpload: (files: File[]) => void;
  isUploading: boolean;
  uploadProgress: number;
}

function WidgetImageDropzone({ value, onChange, onUpload, isUploading, uploadProgress }: WidgetImageDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onUpload,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-lg overflow-hidden transition-all h-48 ${
        isDragActive 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
      } ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      data-testid="widget-dropzone"
    >
      <input {...getInputProps()} data-testid="input-widget-file-upload" />
      
      {value && !isUploading ? (
        // Image Preview Inside Dropzone
        <div className="relative group h-full">
          <img 
            src={value} 
            alt="Widget preview" 
            className="w-full h-full object-cover"
            data-testid="img-widget-preview"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
            <CheckCircle2 className="h-12 w-12 text-green-400" />
            <p className="text-white text-sm font-medium">Image uploaded</p>
            <p className="text-gray-300 text-xs">Click or drag to replace</p>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              data-testid="button-remove-widget-image"
              className="mt-2"
            >
              <X className="h-4 w-4 mr-1" />
              Remove Image
            </Button>
          </div>
        </div>
      ) : isUploading ? (
        // Upload Progress
        <div className="h-full flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-blue-200 dark:border-blue-900 flex items-center justify-center">
              <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
          </div>
          <div className="w-full max-w-xs space-y-2 px-8">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Please wait while we upload your image</p>
        </div>
      ) : (
        // Empty State
        <div className="h-full flex flex-col items-center justify-center gap-3">
          <ImageIcon className="h-16 w-16 text-gray-400" />
          {isDragActive ? (
            <p className="text-base text-blue-600 dark:text-blue-400 font-medium">
              Drop the image here
            </p>
          ) : (
            <>
              <p className="text-base text-gray-600 dark:text-gray-400 font-medium">
                Drag & drop an image here, or click to select
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                PNG, JPG, GIF, WEBP up to 5MB
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function HomeSettings() {
  const { toast } = useToast();
  
  const { data: slides = [], isLoading: slidesLoading } = useQuery<HomeSlide[]>({
    queryKey: ['home-slides'],
    queryFn: homeSlideQueries.getAll,
  });

  const { data: widgetItems = [], isLoading: widgetItemsLoading } = useQuery<HomeWidgetItem[]>({
    queryKey: ['home-widget-items'],
    queryFn: homeWidgetItemQueries.getAll,
  });

  const [isSlideDialogOpen, setIsSlideDialogOpen] = useState(false);
  const [isWidgetDialogOpen, setIsWidgetDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HomeSlide | null>(null);
  const [slideForm, setSlideForm] = useState({
    position: 0,
    imageUrl: "",
    redirectUrl: "",
    text: "",
  });

  const [editingWidget, setEditingWidget] = useState<HomeWidgetItem | null>(null);
  const [widgetForm, setWidgetForm] = useState({
    position: 0,
    image: "",
    title: "",
    subtitle: "",
    redirectUrl: "",
    ctaText: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const createSlideMutation = useMutation({
    mutationFn: (data: Partial<HomeSlide>) => homeSlideQueries.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-slides'] });
      toast({ title: "Slide created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateSlideMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HomeSlide> }) =>
      homeSlideQueries.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-slides'] });
      toast({ title: "Slide updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteSlideMutation = useMutation({
    mutationFn: (id: string) => homeSlideQueries.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-slides'] });
      toast({ title: "Slide deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const createWidgetItemMutation = useMutation({
    mutationFn: (data: Partial<HomeWidgetItem>) => homeWidgetItemQueries.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-widget-items'] });
      toast({ title: "Widget created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateWidgetItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HomeWidgetItem> }) =>
      homeWidgetItemQueries.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-widget-items'] });
      toast({ title: "Widget updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteWidgetItemMutation = useMutation({
    mutationFn: (id: string) => homeWidgetItemQueries.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-widget-items'] });
      toast({ title: "Widget deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });


  const handleCreateSlide = () => {
    setEditingSlide(null);
    setSlideForm({ position: slides.length, imageUrl: "", redirectUrl: "", text: "" });
    setIsSlideDialogOpen(true);
  };

  const handleEditSlide = (slide: HomeSlide) => {
    setEditingSlide(slide);
    setSlideForm({
      position: slide.position,
      imageUrl: slide.imageUrl,
      redirectUrl: slide.redirectUrl,
      text: slide.text || "",
    });
    setIsSlideDialogOpen(true);
  };

  const handleDeleteSlide = (id: string) => {
    deleteSlideMutation.mutate(id);
  };

  const handleCreateWidget = () => {
    setEditingWidget(null);
    setWidgetForm({ position: widgetItems.length, image: "", title: "", subtitle: "", redirectUrl: "", ctaText: "" });
    setIsWidgetDialogOpen(true);
  };

  const handleEditWidget = (widget: HomeWidgetItem) => {
    setEditingWidget(widget);
    setWidgetForm({
      position: widget.position,
      image: widget.image,
      title: widget.title,
      subtitle: widget.subtitle || "",
      redirectUrl: widget.redirectUrl,
      ctaText: widget.ctaText || "",
    });
    setIsWidgetDialogOpen(true);
  };

  const handleDeleteWidget = (id: string) => {
    deleteWidgetItemMutation.mutate(id);
  };

  const handleSaveWidget = () => {
    if (editingWidget) {
      updateWidgetItemMutation.mutate({
        id: editingWidget.id,
        data: widgetForm,
      });
    } else {
      createWidgetItemMutation.mutate(widgetForm);
    }
    setIsWidgetDialogOpen(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, formType: 'slide' | 'widget') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const folderName = formType === 'slide' ? 'slides' : 'widgets';
      const filePath = `${folderName}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('home-slides')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        if (error.message.includes('Bucket not found')) {
          const { error: bucketError } = await supabase.storage.createBucket('home-slides', {
            public: true,
            fileSizeLimit: 5242880
          });

          if (bucketError && !bucketError.message.includes('already exists')) {
            throw bucketError;
          }

          const { data: retryData, error: retryError } = await supabase.storage
            .from('home-slides')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (retryError) throw retryError;

          const { data: { publicUrl } } = supabase.storage
            .from('home-slides')
            .getPublicUrl(retryData.path);

          if (formType === 'slide') {
            setSlideForm({ ...slideForm, imageUrl: publicUrl });
          } else {
            setWidgetForm({ ...widgetForm, image: publicUrl });
          }
          toast({
            title: "Upload successful",
            description: "Image uploaded to storage",
          });
        } else {
          throw error;
        }
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('home-slides')
          .getPublicUrl(data.path);

        if (formType === 'slide') {
          setSlideForm({ ...slideForm, imageUrl: publicUrl });
        } else {
          setWidgetForm({ ...widgetForm, image: publicUrl });
        }
        toast({
          title: "Upload successful",
          description: "Image uploaded to storage",
        });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      
      let errorMessage = error.message || "Failed to upload image";
      
      // Check for specific RLS policy error
      if (error.message?.includes('row-level security') || error.message?.includes('policy')) {
        errorMessage = "Storage permissions not configured. Please run the SQL migration in supabase/migrations/setup_storage_policies.sql";
      }
      
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: errorMessage,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDropzoneUpload = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress for better UX (since Supabase doesn't provide real-time progress)
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 200);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `widgets/${fileName}`;

      const { data, error } = await supabase.storage
        .from('home-slides')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        clearInterval(progressInterval);
        if (error.message.includes('Bucket not found')) {
          const { error: bucketError } = await supabase.storage.createBucket('home-slides', {
            public: true,
            fileSizeLimit: 5242880
          });

          if (bucketError && !bucketError.message.includes('already exists')) {
            throw bucketError;
          }

          const { data: retryData, error: retryError } = await supabase.storage
            .from('home-slides')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (retryError) throw retryError;

          const { data: { publicUrl } } = supabase.storage
            .from('home-slides')
            .getPublicUrl(retryData.path);

          setUploadProgress(100);
          setWidgetForm({ ...widgetForm, image: publicUrl });
          toast({
            title: "Upload successful",
            description: "Image uploaded to storage",
          });
        } else {
          throw error;
        }
      } else {
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        const { data: { publicUrl } } = supabase.storage
          .from('home-slides')
          .getPublicUrl(data.path);

        setWidgetForm({ ...widgetForm, image: publicUrl });
        toast({
          title: "Upload successful",
          description: "Image uploaded to storage",
        });
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error('Upload error:', error);
      
      let errorMessage = error.message || "Failed to upload image";
      
      // Check for specific RLS policy error
      if (error.message?.includes('row-level security') || error.message?.includes('policy')) {
        errorMessage = "Storage permissions not configured. Please run the SQL migration in supabase/migrations/setup_storage_policies.sql";
      }
      
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: errorMessage,
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  };

  const handleSaveSlide = () => {
    if (editingSlide) {
      updateSlideMutation.mutate(
        { id: editingSlide.id, data: slideForm },
        { onSuccess: () => setIsSlideDialogOpen(false) }
      );
    } else {
      createSlideMutation.mutate(slideForm, {
        onSuccess: () => setIsSlideDialogOpen(false),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-page-title">Home Layout Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage home page slides and widget layout
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Home Slides</CardTitle>
            <Button onClick={handleCreateSlide} data-testid="button-create-slide">
              <Plus className="h-4 w-4 mr-2" />
              Add Slide
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {slides.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No slides configured. Click "Add Slide" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3">Position</th>
                    <th className="px-6 py-3">Text</th>
                    <th className="px-6 py-3">Image</th>
                    <th className="px-6 py-3">Redirect URL</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slides.sort((a, b) => a.position - b.position).map((slide) => (
                    <tr
                      key={slide.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      data-testid={`slide-row-${slide.id}`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {slide.position}
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white max-w-[200px]">
                        {slide.text || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <img 
                          src={slide.imageUrl} 
                          alt={slide.text || "Slide image"} 
                          className="h-16 w-24 object-cover rounded border border-gray-200 dark:border-gray-600"
                          data-testid={`img-slide-${slide.id}`}
                        />
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-[250px]">
                        {slide.redirectUrl}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditSlide(slide)}
                            data-testid={`button-edit-slide-${slide.id}`}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSlide(slide.id)}
                            data-testid={`button-delete-slide-${slide.id}`}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
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

      <Card>
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Home Widget</CardTitle>
            <Button onClick={handleCreateWidget} data-testid="button-create-widget">
              <Plus className="h-4 w-4 mr-2" />
              Add Widget
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {widgetItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No widgets configured. Click "Add Widget" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3">Position</th>
                    <th className="px-6 py-3">Image</th>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Subtitle</th>
                    <th className="px-6 py-3">CTA Text</th>
                    <th className="px-6 py-3">Redirect URL</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {widgetItems.sort((a, b) => a.position - b.position).map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      data-testid={`widget-row-${item.id}`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {item.position}
                      </td>
                      <td className="px-6 py-4">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="h-16 w-24 object-cover rounded border border-gray-200 dark:border-gray-600"
                          data-testid={`img-widget-${item.id}`}
                        />
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white max-w-[200px]">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-[200px]">
                        {item.subtitle || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-[150px]">
                        {item.ctaText ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {item.ctaText}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-[250px]">
                        {item.redirectUrl}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditWidget(item)}
                            data-testid={`button-edit-widget-${item.id}`}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteWidget(item.id)}
                            data-testid={`button-delete-widget-${item.id}`}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
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

      <Dialog open={isSlideDialogOpen} onOpenChange={setIsSlideDialogOpen}>
        <DialogContent data-testid="dialog-slide-form">
          <DialogHeader>
            <DialogTitle>{editingSlide ? "Edit Slide" : "Create New Slide"}</DialogTitle>
            <DialogDescription>
              {editingSlide ? "Update slide details" : "Add a new slide to the home page"}
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
                value={slideForm.position}
                onChange={(e) => setSlideForm({ ...slideForm, position: parseInt(e.target.value) || 0 })}
                data-testid="input-slide-position"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text">Text</Label>
              <Input
                id="text"
                type="text"
                placeholder="Slide title or description"
                value={slideForm.text}
                onChange={(e) => setSlideForm({ ...slideForm, text: e.target.value })}
                data-testid="input-slide-text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image</Label>
              <div className="flex gap-2">
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/slide.jpg"
                  value={slideForm.imageUrl}
                  onChange={(e) => setSlideForm({ ...slideForm, imageUrl: e.target.value })}
                  data-testid="input-slide-image"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={isUploading}
                  data-testid="button-upload-image"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'slide')}
                  className="hidden"
                  data-testid="input-file-upload"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Upload an image or paste a URL
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="redirectUrl">Redirect URL</Label>
              <Select
                value={slideForm.redirectUrl}
                onValueChange={(value) => setSlideForm({ ...slideForm, redirectUrl: value })}
              >
                <SelectTrigger data-testid="input-slide-redirect">
                  <SelectValue placeholder="Select a route" />
                </SelectTrigger>
                <SelectContent>
                  {FLUTTER_ROUTES.map((route) => (
                    <SelectItem key={route.value} value={route.value}>
                      {route.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSlideDialogOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button onClick={handleSaveSlide} data-testid="button-save-slide">
              {editingSlide ? "Save Changes" : "Create Slide"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isWidgetDialogOpen} onOpenChange={setIsWidgetDialogOpen}>
        <DialogContent data-testid="dialog-widget-form">
          <DialogHeader>
            <DialogTitle>{editingWidget ? "Edit Widget" : "Create New Widget"}</DialogTitle>
            <DialogDescription>
              {editingWidget ? "Update widget details" : "Add a new widget to the home page"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="widget-position">Position</Label>
              <Input
                id="widget-position"
                type="number"
                min="0"
                placeholder="0"
                value={widgetForm.position}
                onChange={(e) => setWidgetForm({ ...widgetForm, position: parseInt(e.target.value) || 0 })}
                data-testid="input-widget-position"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="widget-title">Title</Label>
              <Input
                id="widget-title"
                type="text"
                placeholder="Widget title"
                value={widgetForm.title}
                onChange={(e) => setWidgetForm({ ...widgetForm, title: e.target.value })}
                data-testid="input-widget-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="widget-subtitle">Subtitle</Label>
              <Input
                id="widget-subtitle"
                type="text"
                placeholder="Widget subtitle (optional)"
                value={widgetForm.subtitle}
                onChange={(e) => setWidgetForm({ ...widgetForm, subtitle: e.target.value })}
                data-testid="input-widget-subtitle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="widget-image">Image</Label>
              <WidgetImageDropzone 
                value={widgetForm.image}
                onChange={(url) => setWidgetForm({ ...widgetForm, image: url })}
                onUpload={handleDropzoneUpload}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="widget-redirect">Redirect URL</Label>
                <Select
                  value={widgetForm.redirectUrl}
                  onValueChange={(value) => setWidgetForm({ ...widgetForm, redirectUrl: value })}
                >
                  <SelectTrigger data-testid="input-widget-redirect">
                    <SelectValue placeholder="Select a route" />
                  </SelectTrigger>
                  <SelectContent>
                    {FLUTTER_ROUTES.map((route) => (
                      <SelectItem key={route.value} value={route.value}>
                        {route.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="widget-cta">CTA Button Text</Label>
                <Input
                  id="widget-cta"
                  type="text"
                  placeholder="e.g., Get Started"
                  value={widgetForm.ctaText}
                  onChange={(e) => setWidgetForm({ ...widgetForm, ctaText: e.target.value })}
                  data-testid="input-widget-cta"
                />
              
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWidgetDialogOpen(false)} data-testid="button-widget-cancel">
              Cancel
            </Button>
            <Button onClick={handleSaveWidget} data-testid="button-save-widget">
              {editingWidget ? "Save Changes" : "Create Widget"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
