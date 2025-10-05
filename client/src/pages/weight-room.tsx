import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Clock, Dumbbell } from "lucide-react";
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
import { useQuery } from "@tanstack/react-query";
import { weightRoomQueries } from "@/lib/supabase-queries";
import type { WeightRoomCollection } from "@shared/schema";

type Video = {
  id: string;
  title: string;
  category: string;
  duration: number;
};

export default function WeightRoom() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("collections");

  const { data: collections = [], isLoading } = useQuery<WeightRoomCollection[]>({
    queryKey: ['weight-room-collections'],
    queryFn: weightRoomQueries.getAll,
  });

  const trainingVideos: Video[] = [
    { id: "1", title: "Proper Squat Form", category: "Technique", duration: 420 },
    { id: "2", title: "Bench Press Mistakes", category: "Common Errors", duration: 360 },
    { id: "3", title: "Deadlift Progression", category: "Progressive Overload", duration: 540 },
    { id: "4", title: "Pull-up Variations", category: "Technique", duration: 480 },
    { id: "5", title: "Core Routine", category: "Workout", duration: 900 },
    { id: "6", title: "Mobility Warmup", category: "Preparation", duration: 600 },
  ];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Weight Room</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage exercise collections and training videos
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} data-testid="button-create-content">
          <Plus className="h-4 w-4 mr-2" />
          Add Content
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
                      <Button size="sm" variant="outline" className="flex-1" data-testid={`button-edit-collection-${collection.id}`}>
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" data-testid={`button-view-collection-${collection.id}`}>
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trainingVideos.map((video) => (
              <Card key={video.id} className="hover-elevate" data-testid={`training-video-${video.id}`}>
                <CardHeader className="p-0">
                  <div className="aspect-video bg-muted rounded-t-md flex items-center justify-center relative">
                    <Play className="h-12 w-12 text-primary" />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {formatDuration(video.duration)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="font-medium text-sm">{video.title}</div>
                    <Badge variant="secondary">{video.category}</Badge>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" data-testid={`button-watch-${video.id}`}>
                      Watch
                    </Button>
                    <Button size="sm" variant="ghost" data-testid={`button-edit-video-${video.id}`}>
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent data-testid="dialog-weight-room-form">
          <DialogHeader>
            <DialogTitle>Add Weight Room Content</DialogTitle>
            <DialogDescription>
              Create a new collection or upload training video
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Content title" data-testid="input-content-title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Details about this content" data-testid="input-content-description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)} data-testid="button-save-content">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
