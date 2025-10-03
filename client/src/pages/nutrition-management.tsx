import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Clock } from "lucide-react";
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

type MealPlan = {
  id: string;
  title: string;
  meals: string[];
  calories: number;
};

type Video = {
  id: string;
  title: string;
  category: string;
  duration: number;
  thumbnail: string;
};

export default function NutritionManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("daily");

  const dailyPlans: MealPlan[] = [
    { id: "1", title: "High Protein Plan", meals: ["Greek Yogurt Bowl", "Grilled Chicken Salad", "Salmon & Veggies", "Protein Shake"], calories: 2100 },
    { id: "2", title: "Balanced Nutrition", meals: ["Oatmeal & Berries", "Turkey Wrap", "Quinoa Bowl", "Mixed Nuts"], calories: 1900 },
  ];

  const weeklyPlans: MealPlan[] = [
    { id: "1", title: "Muscle Building Week", meals: ["7 days of high-protein meals"], calories: 14700 },
    { id: "2", title: "Weight Loss Week", meals: ["7 days of calorie-deficit meals"], calories: 11900 },
  ];

  const trainingVideos: Video[] = [
    { id: "1", title: "Macro Basics for Athletes", category: "Education", duration: 840, thumbnail: "" },
    { id: "2", title: "Meal Prep Sunday Routine", category: "Practical", duration: 1200, thumbnail: "" },
    { id: "3", title: "Pre-Workout Nutrition", category: "Performance", duration: 480, thumbnail: "" },
    { id: "4", title: "Hydration Strategies", category: "Performance", duration: 360, thumbnail: "" },
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
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Nutrition Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage meal plans and nutrition content
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} data-testid="button-create-plan">
          <Plus className="h-4 w-4 mr-2" />
          Add Content
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList data-testid="tabs-nutrition">
          <TabsTrigger value="daily" data-testid="tab-daily">Daily Plans</TabsTrigger>
          <TabsTrigger value="weekly" data-testid="tab-weekly">Weekly Plans</TabsTrigger>
          <TabsTrigger value="videos" data-testid="tab-videos">Training Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {dailyPlans.map((plan) => (
              <Card key={plan.id} className="hover-elevate" data-testid={`plan-item-${plan.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg">{plan.title}</CardTitle>
                    <Badge>{plan.calories} cal</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {plan.meals.map((meal, i) => (
                      <div key={i} className="text-sm p-2 bg-muted/50 rounded">
                        {meal}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" data-testid={`button-edit-plan-${plan.id}`}>
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" data-testid={`button-duplicate-plan-${plan.id}`}>
                      Duplicate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {weeklyPlans.map((plan) => (
              <Card key={plan.id} className="hover-elevate" data-testid={`weekly-plan-${plan.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg">{plan.title}</CardTitle>
                    <Badge>{plan.calories} cal/week</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{plan.meals[0]}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" data-testid={`button-edit-weekly-${plan.id}`}>
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" data-testid={`button-view-weekly-${plan.id}`}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trainingVideos.map((video) => (
              <Card key={video.id} className="hover-elevate" data-testid={`video-item-${video.id}`}>
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
        <DialogContent data-testid="dialog-nutrition-form">
          <DialogHeader>
            <DialogTitle>Add Nutrition Content</DialogTitle>
            <DialogDescription>
              Create a new meal plan or upload training video
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Content title" data-testid="input-nutrition-title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Details about this content" data-testid="input-nutrition-description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)} data-testid="button-save-nutrition">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
