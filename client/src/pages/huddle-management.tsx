import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar as CalendarIcon, Clock, Trash2, Upload, Link as LinkIcon, ImageIcon, CheckCircle2, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { huddleQueries } from "@/lib/supabase-queries";
import { supabase } from "@/lib/supabase";
import type { Huddle, InsertHuddle } from "@shared/schema";

export default function HuddleManagement() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHuddle, setEditingHuddle] = useState<Huddle | null>(null);
  const [nextHuddle, setNextHuddle] = useState<Huddle | null>(null);
  const [countdown, setCountdown] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledAt: "",
    duration: 30,
    status: "upcoming",
    image: "",
  });

  const { data: huddles = [], isLoading } = useQuery({
    queryKey: ['/api/huddles'],
    queryFn: () => huddleQueries.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (huddle: InsertHuddle) => huddleQueries.create(huddle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/huddles'] });
      toast({ title: "Success", description: "Huddle scheduled successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to schedule huddle",
        variant: "destructive" 
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Huddle> }) => 
      huddleQueries.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/huddles'] });
      toast({ title: "Success", description: "Huddle updated successfully" });
      setIsDialogOpen(false);
      setEditingHuddle(null);
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update huddle",
        variant: "destructive" 
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => huddleQueries.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/huddles'] });
      toast({ title: "Success", description: "Huddle deleted successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete huddle",
        variant: "destructive" 
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      scheduledAt: "",
      duration: 30,
      status: "upcoming",
      image: "",
    });
    setImagePreview("");
  };

  const handleOpenDialog = (huddle?: Huddle) => {
    if (huddle) {
      setEditingHuddle(huddle);
      setFormData({
        title: huddle.title,
        description: huddle.description || "",
        scheduledAt: new Date(huddle.scheduledAt).toISOString().slice(0, 16),
        duration: huddle.duration,
        status: huddle.status,
        image: huddle.image || "",
      });
      setImagePreview(huddle.image || "");
    } else {
      setEditingHuddle(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    setUploadingImage(true);

    try {
      const fileName = `huddle-${Date.now()}-${file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const { data, error } = await supabase.storage
        .from('recipe-images')
        .upload(fileName, file);

      if (error) {
        if (error.message.includes('Bucket not found')) {
          toast({
            title: "Storage Not Configured",
            description: "Please create 'recipe-images' bucket in Supabase Storage with public access policies.",
            variant: "destructive",
            duration: 10000,
          });
        } else {
          throw error;
        }
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(fileName);

      setFormData({ ...formData, image: publicUrl });
      setImagePreview(publicUrl);
      toast({ title: "Success", description: "Image uploaded successfully" });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleImageUpload(acceptedFiles[0]);
    }
  }, [formData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: uploadingImage
  });

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, image: url });
    setImagePreview(url);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.scheduledAt) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const huddleData = {
      title: formData.title,
      description: formData.description,
      scheduledAt: new Date(formData.scheduledAt),
      duration: formData.duration,
      status: formData.status,
      image: formData.image,
    };

    if (editingHuddle) {
      updateMutation.mutate({ id: editingHuddle.id, data: huddleData });
    } else {
      createMutation.mutate(huddleData);
    }
  };

  useEffect(() => {
    if (!huddles.length) return;
    
    const upcoming = huddles
      .filter(h => h.status === "upcoming")
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0];
    setNextHuddle(upcoming);
  }, [huddles]);

  useEffect(() => {
    if (!nextHuddle) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = new Date(nextHuddle.scheduledAt).getTime() - now.getTime();

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
        <Button onClick={() => handleOpenDialog()} data-testid="button-create-huddle">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Huddle
        </Button>
      </div>

      {nextHuddle && (
        <Card className="relative overflow-hidden border-primary/20">
          {nextHuddle.image && (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${nextHuddle.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50" />
            </>
          )}
          <div className="relative">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <CalendarIcon className="h-5 w-5" />
                Next Huddle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="font-semibold text-lg text-white" data-testid="text-next-huddle-title">{nextHuddle.title}</div>
                  <p className="text-sm text-white/80">{nextHuddle.description}</p>
                </div>
                <div className="text-3xl font-bold font-mono tracking-tight text-white" data-testid="text-huddle-countdown">
                  {countdown || "Loading..."}
                </div>
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {new Date(nextHuddle.scheduledAt).toLocaleString('en-US', {
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
          </div>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Huddles</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading huddles...</div>
          ) : huddles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No huddles scheduled yet</div>
          ) : (
            <div className="space-y-3">
              {huddles.map((huddle) => (
                <div
                  key={huddle.id}
                  className="p-4 rounded-md border hover-elevate"
                  data-testid={`huddle-item-${huddle.id}`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4 flex-1">
                      {huddle.image && (
                        <img 
                          src={huddle.image} 
                          alt={huddle.title}
                          className="w-16 h-16 rounded-md object-cover"
                        />
                      )}
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
                            {new Date(huddle.scheduledAt).toLocaleString('en-US', {
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
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleOpenDialog(huddle)}
                        data-testid={`button-edit-huddle-${huddle.id}`}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteMutation.mutate(huddle.id)}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-huddle-${huddle.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-huddle-form">
          <DialogHeader>
            <DialogTitle>{editingHuddle ? "Edit Huddle" : "Schedule New Huddle"}</DialogTitle>
            <DialogDescription>
              {editingHuddle ? "Update huddle details" : "Create a new team meeting"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title" 
                placeholder="Team Standup" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                data-testid="input-huddle-title" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="What will this huddle be about?" 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                data-testid="input-huddle-description" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date & Time *</Label>
                <Input 
                  id="date" 
                  type="datetime-local" 
                  value={formData.scheduledAt || ''}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  min={new Date().toISOString().slice(0, 16)}
                  data-testid="input-huddle-datetime" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input 
                  id="duration" 
                  type="number" 
                  placeholder="30" 
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  data-testid="input-huddle-duration" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Huddle Image</Label>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload" data-testid="tab-upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </TabsTrigger>
                  <TabsTrigger value="url" data-testid="tab-url">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    URL
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="space-y-2">
                  <div
                    {...getRootProps()}
                    className={`
                      relative border-2 border-dashed rounded-lg overflow-hidden transition-all h-48
                      ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-600'}
                      ${uploadingImage ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5 cursor-pointer'}
                    `}
                    data-testid="dropzone-upload"
                  >
                    <input {...getInputProps()} data-testid="input-image-upload" />
                    
                    {imagePreview && !uploadingImage ? (
                      // Image Preview Inside Dropzone
                      <div className="relative group h-full">
                        <img 
                          src={imagePreview} 
                          alt="Huddle preview" 
                          className="w-full h-full object-cover"
                          data-testid="img-preview"
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
                              setFormData({ ...formData, image: '' });
                              setImagePreview('');
                            }}
                            data-testid="button-remove-image"
                            className="mt-2"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove Image
                          </Button>
                        </div>
                      </div>
                    ) : uploadingImage ? (
                      // Upload Progress
                      <div className="flex flex-col items-center justify-center h-full gap-2">
                        <Upload className="h-10 w-10 text-primary animate-pulse" />
                        <p className="text-sm font-medium text-muted-foreground">Uploading image...</p>
                      </div>
                    ) : (
                      // Empty State
                      <div className="flex flex-col items-center justify-center h-full gap-2 p-8">
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                        {isDragActive ? (
                          <p className="text-sm font-medium text-primary">Drop the image here</p>
                        ) : (
                          <>
                            <p className="text-sm font-medium">Drag & drop an image here</p>
                            <p className="text-xs text-muted-foreground">or click to browse</p>
                            <p className="text-xs text-muted-foreground mt-2">Max file size: 5MB</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="url" className="space-y-2">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    data-testid="input-image-url"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-md border"
                        data-testid="img-url-preview"
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false);
                setEditingHuddle(null);
                resetForm();
              }} 
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-save-huddle"
            >
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : (editingHuddle ? "Update" : "Schedule")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
