import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Clock, Dumbbell, Upload, Trash2, Edit } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { weightRoomQueries, weightRoomVideoQueries, storageHelpers } from "@/lib/supabase-queries";
import { useToast } from "@/hooks/use-toast";
import type { WeightRoomCollection, WeightRoomVideo } from "@shared/schema";

export default function WeightRoom() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("collections");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("all");
  const [editingCollection, setEditingCollection] = useState<WeightRoomCollection | null>(null);
  const [editingVideo, setEditingVideo] = useState<WeightRoomVideo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    position: 0,
    title: "",
    subtitle: "",
    image: "",
  });
  const [videoFormData, setVideoFormData] = useState({
    collectionId: "",
    title: "",
    description: "",
    videoUrl: "",
  });

  const { data: collections = [], isLoading } = useQuery<WeightRoomCollection[]>({
    queryKey: ['weight-room-collections'],
    queryFn: weightRoomQueries.getAll,
  });

  const { data: videos = [], isLoading: videosLoading } = useQuery<WeightRoomVideo[]>({
    queryKey: ['weight-room-videos'],
    queryFn: weightRoomVideoQueries.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<WeightRoomCollection>) => weightRoomQueries.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-room-collections'] });
      toast({ title: "Collection created successfully" });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WeightRoomCollection> }) =>
      weightRoomQueries.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-room-collections'] });
      toast({ title: "Collection updated successfully" });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => weightRoomQueries.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-room-collections'] });
      toast({ title: "Collection deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const createVideoMutation = useMutation({
    mutationFn: (data: Partial<WeightRoomVideo>) => weightRoomVideoQueries.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-room-videos'] });
      toast({ title: "Video created successfully" });
      setIsVideoDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateVideoMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WeightRoomVideo> }) =>
      weightRoomVideoQueries.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-room-videos'] });
      toast({ title: "Video updated successfully" });
      setIsVideoDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: (id: string) => weightRoomVideoQueries.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-room-videos'] });
      toast({ title: "Video deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleCreate = () => {
    setEditingCollection(null);
    setFormData({
      position: collections.length,
      title: "",
      subtitle: "",
      image: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (collection: WeightRoomCollection) => {
    setEditingCollection(collection);
    setFormData({
      position: collection.position,
      title: collection.title,
      subtitle: collection.subtitle || "",
      image: collection.image,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (collection: WeightRoomCollection) => {
    if (confirm(`Are you sure you want to delete "${collection.title}"?`)) {
      deleteMutation.mutate(collection.id);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const fileName = `weight-room-${Date.now()}-${file.name}`;
      await storageHelpers.uploadFile('user-avatars', fileName, file);
      const publicUrl = storageHelpers.getPublicUrl('user-avatars', fileName);
      
      setFormData({ ...formData, image: publicUrl });
      setUploadProgress(100);
      toast({ title: "Image uploaded successfully" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.image) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Title and image are required",
      });
      return;
    }

    if (editingCollection) {
      updateMutation.mutate({ id: editingCollection.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleCreateVideo = () => {
    setEditingVideo(null);
    setVideoFormData({
      collectionId: selectedCollectionId !== "all" ? selectedCollectionId : collections[0]?.id || "",
      title: "",
      description: "",
      videoUrl: "",
    });
    setIsVideoDialogOpen(true);
  };

  const handleEditVideo = (video: WeightRoomVideo) => {
    setEditingVideo(video);
    setVideoFormData({
      collectionId: video.collectionId,
      title: video.title,
      description: video.description || "",
      videoUrl: video.videoUrl,
    });
    setIsVideoDialogOpen(true);
  };

  const handleDeleteVideo = (video: WeightRoomVideo) => {
    if (confirm(`Are you sure you want to delete "${video.title}"?`)) {
      deleteVideoMutation.mutate(video.id);
    }
  };

  const handleSaveVideo = () => {
    if (!videoFormData.title || !videoFormData.videoUrl || !videoFormData.collectionId) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Collection, title, and video URL are required",
      });
      return;
    }

    if (editingVideo) {
      updateVideoMutation.mutate({ id: editingVideo.id, data: videoFormData });
    } else {
      createVideoMutation.mutate(videoFormData);
    }
  };

  const filteredVideos = selectedCollectionId === "all" 
    ? videos 
    : videos.filter(v => v.collectionId === selectedCollectionId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Weight Room</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage exercise collections and training videos
          </p>
        </div>
        <Button onClick={handleCreate} data-testid="button-create-content">
          <Plus className="h-4 w-4 mr-2" />
          Add Collection
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList data-testid="tabs-weight-room">
          <TabsTrigger value="collections" data-testid="tab-collections">Collections</TabsTrigger>
          <TabsTrigger value="videos" data-testid="tab-training-videos">Training Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="collections" className="space-y-4 mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading collections...</p>
            </div>
          ) : collections.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No collections found. Click "Add Content" to create one.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection) => (
                <Card key={collection.id} className="hover-elevate" data-testid={`collection-item-${collection.id}`}>
                  <CardHeader className="p-0">
                    <div className="aspect-video bg-muted rounded-t-md overflow-hidden">
                      <img 
                        src={collection.image} 
                        alt={collection.title}
                        className="w-full h-full object-cover"
                        data-testid={`img-collection-${collection.id}`}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{collection.title}</CardTitle>
                      {collection.subtitle && (
                        <p className="text-sm text-muted-foreground">
                          {collection.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleEdit(collection)}
                        data-testid={`button-edit-collection-${collection.id}`}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDelete(collection)}
                        data-testid={`button-delete-collection-${collection.id}`}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos" className="space-y-4 mt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="collection-filter" className="text-sm font-medium">Filter by Collection:</Label>
              <Select value={selectedCollectionId} onValueChange={setSelectedCollectionId}>
                <SelectTrigger className="w-64" data-testid="select-collection-filter">
                  <SelectValue placeholder="Select a collection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Collections</SelectItem>
                  {collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreateVideo} data-testid="button-add-video">
              <Plus className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          </div>

          {videosLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading videos...</p>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No videos found.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredVideos.map((video) => (
                <Card key={video.id} className="hover-elevate" data-testid={`training-video-${video.id}`}>
                  <CardHeader className="p-0">
                    <div className="aspect-video bg-muted rounded-t-md flex items-center justify-center relative">
                      <Play className="h-12 w-12 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="font-medium text-sm" data-testid={`text-video-title-${video.id}`}>
                        {video.title}
                      </div>
                      {video.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {video.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => window.open(video.videoUrl, '_blank')}
                        data-testid={`button-watch-${video.id}`}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Watch
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleEditVideo(video)}
                        data-testid={`button-edit-video-${video.id}`}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDeleteVideo(video)}
                        data-testid={`button-delete-video-${video.id}`}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent data-testid="dialog-weight-room-form">
          <DialogHeader>
            <DialogTitle>{editingCollection ? "Edit Collection" : "Create New Collection"}</DialogTitle>
            <DialogDescription>
              {editingCollection ? "Update collection details" : "Add a new weight room collection"}
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
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })}
                data-testid="input-collection-position"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Collection title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                data-testid="input-collection-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                placeholder="Collection subtitle (optional)"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                data-testid="input-collection-subtitle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <div className="flex gap-2">
                <Input
                  id="image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  data-testid="input-collection-image"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('collection-file-upload')?.click()}
                  disabled={isUploading}
                  data-testid="button-upload-collection-image"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
                <input
                  id="collection-file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  data-testid="input-collection-file-upload"
                />
              </div>
              {formData.image && (
                <div className="mt-2">
                  <img 
                    src={formData.image} 
                    alt="Collection preview" 
                    className="h-32 w-48 object-cover rounded border border-gray-200 dark:border-gray-600"
                    data-testid="img-collection-preview"
                  />
                </div>
              )}
              {isUploading && (
                <div className="mt-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-center text-gray-500 mt-1">Uploading... {uploadProgress}%</p>
                </div>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Upload an image or paste a URL
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-save-collection"
            >
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingCollection ? "Save Changes" : "Create Collection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent data-testid="dialog-video-form">
          <DialogHeader>
            <DialogTitle>{editingVideo ? "Edit Video" : "Add New Video"}</DialogTitle>
            <DialogDescription>
              {editingVideo ? "Update video details" : "Add a new training video to a collection"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video-collection">Collection</Label>
              <Select 
                value={videoFormData.collectionId} 
                onValueChange={(value) => setVideoFormData({ ...videoFormData, collectionId: value })}
              >
                <SelectTrigger id="video-collection" data-testid="select-video-collection">
                  <SelectValue placeholder="Select a collection" />
                </SelectTrigger>
                <SelectContent>
                  {collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="video-title">Title</Label>
              <Input
                id="video-title"
                placeholder="Video title"
                value={videoFormData.title}
                onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                data-testid="input-video-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video-description">Description</Label>
              <Textarea
                id="video-description"
                placeholder="Video description (optional)"
                value={videoFormData.description}
                onChange={(e) => setVideoFormData({ ...videoFormData, description: e.target.value })}
                data-testid="input-video-description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video-url">Video URL</Label>
              <Input
                id="video-url"
                type="url"
                placeholder="https://example.com/video.mp4"
                value={videoFormData.videoUrl}
                onChange={(e) => setVideoFormData({ ...videoFormData, videoUrl: e.target.value })}
                data-testid="input-video-url"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVideoDialogOpen(false)} data-testid="button-cancel-video">
              Cancel
            </Button>
            <Button 
              onClick={handleSaveVideo}
              disabled={createVideoMutation.isPending || updateVideoMutation.isPending}
              data-testid="button-save-video"
            >
              {createVideoMutation.isPending || updateVideoMutation.isPending ? "Saving..." : editingVideo ? "Save Changes" : "Add Video"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
