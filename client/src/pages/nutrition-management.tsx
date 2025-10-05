import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ChefHat } from "lucide-react";
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
import { useQuery } from "@tanstack/react-query";
import { recipeQueries } from "@/lib/supabase-queries";
import { Skeleton } from "@/components/ui/skeleton";

export default function NutritionManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("daily");

  const { data: recipes, isLoading } = useQuery({
    queryKey: ['/recipes'],
    queryFn: () => recipeQueries.getAll(),
  });

  const dailyRecipes = recipes?.filter(r => r.type === 'daily') || [];
  const weeklyRecipes = recipes?.filter(r => r.type === 'weekly') || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Nutrition Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage recipes and meal plans
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} data-testid="button-create-recipe">
          <Plus className="h-4 w-4 mr-2" />
          Add Recipe
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList data-testid="tabs-nutrition">
          <TabsTrigger value="daily" data-testid="tab-daily">Daily Recipes</TabsTrigger>
          <TabsTrigger value="weekly" data-testid="tab-weekly">Weekly Meal Prep</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4 mt-6">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i}>
                  <CardHeader className="p-0">
                    <Skeleton className="aspect-video w-full rounded-t-md" />
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {dailyRecipes.map((recipe) => (
                <Card key={recipe.id} className="hover-elevate overflow-hidden" data-testid={`recipe-item-${recipe.id}`}>
                  <CardHeader className="p-0">
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      <img 
                        src={recipe.image} 
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1546548970-71785318a17b';
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-black/60 text-white border-0">
                          {recipe.meal}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-base line-clamp-1">{recipe.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>{recipe.ingredients.length} ingredients</span>
                        <span>•</span>
                        <span>{recipe.instructions.length} steps</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" data-testid={`button-view-recipe-${recipe.id}`}>
                        <ChefHat className="h-3 w-3 mr-1" />
                        View Recipe
                      </Button>
                      <Button size="sm" variant="ghost" data-testid={`button-edit-recipe-${recipe.id}`}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" data-testid={`button-delete-recipe-${recipe.id}`}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4 mt-6">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader className="p-0">
                    <Skeleton className="aspect-video w-full rounded-t-md" />
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {weeklyRecipes.map((recipe) => (
                <Card key={recipe.id} className="hover-elevate overflow-hidden" data-testid={`weekly-recipe-${recipe.id}`}>
                  <CardHeader className="p-0">
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      <img 
                        src={recipe.image} 
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1546548970-71785318a17b';
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-black/60 text-white border-0">
                          {recipe.meal}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg line-clamp-1">{recipe.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">{recipe.description}</p>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>{recipe.ingredients.length} ingredients</span>
                        <span>•</span>
                        <span>{recipe.instructions.length} steps</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" data-testid={`button-view-weekly-recipe-${recipe.id}`}>
                        <ChefHat className="h-3 w-3 mr-1" />
                        View Recipe
                      </Button>
                      <Button size="sm" variant="ghost" data-testid={`button-edit-weekly-recipe-${recipe.id}`}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" data-testid={`button-delete-weekly-recipe-${recipe.id}`}>
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
        <DialogContent data-testid="dialog-recipe-form">
          <DialogHeader>
            <DialogTitle>Add Recipe</DialogTitle>
            <DialogDescription>
              Create a new recipe with ingredients and instructions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Recipe title" data-testid="input-recipe-title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Brief description" data-testid="input-recipe-description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)} data-testid="button-save-recipe">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
