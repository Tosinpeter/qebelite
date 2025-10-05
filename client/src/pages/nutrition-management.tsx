import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ChefHat, X, Upload, Image as ImageIcon } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { recipeQueries, storageHelpers } from "@/lib/supabase-queries";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { Recipe } from "@shared/schema";

export default function NutritionManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("daily");
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [deleteRecipe, setDeleteRecipe] = useState<Recipe | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    type: "daily",
    meal: "",
    title: "",
    description: "",
    image: "",
    ingredients: [""],
    instructions: [""],
  });

  const { toast } = useToast();

  const { data: recipes, isLoading } = useQuery({
    queryKey: ['/recipes'],
    queryFn: () => recipeQueries.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Recipe>) => recipeQueries.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/recipes'] });
      toast({
        title: "Success",
        description: "Recipe created successfully",
      });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create recipe",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Recipe> }) =>
      recipeQueries.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/recipes'] });
      toast({
        title: "Success",
        description: "Recipe updated successfully",
      });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update recipe",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => recipeQueries.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/recipes'] });
      toast({
        title: "Success",
        description: "Recipe deleted successfully",
      });
      setDeleteRecipe(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete recipe",
        variant: "destructive",
      });
    },
  });

  const dailyRecipes = recipes?.filter(r => r.type === 'daily') || [];
  const weeklyRecipes = recipes?.filter(r => r.type === 'weekly') || [];

  const handleOpenDialog = (recipe?: Recipe) => {
    if (recipe) {
      setEditingRecipe(recipe);
      setFormData({
        type: recipe.type,
        meal: recipe.meal,
        title: recipe.title,
        description: recipe.description,
        image: recipe.image,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      });
      setImagePreview(recipe.image);
    } else {
      setEditingRecipe(null);
      setFormData({
        type: activeTab === "weekly" ? "weekly" : "daily",
        meal: "",
        title: "",
        description: "",
        image: "",
        ingredients: [""],
        instructions: [""],
      });
      setImagePreview("");
    }
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRecipe(null);
    setImageFile(null);
    setImagePreview("");
    setFormData({
      type: "daily",
      meal: "",
      title: "",
      description: "",
      image: "",
      ingredients: [""],
      instructions: [""],
    });
  };

  const handleAddIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing),
    }));
  };

  const handleAddInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }));
  };

  const handleRemoveInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }));
  };

  const handleInstructionChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => i === index ? value : inst),
    }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file",
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
    const ingredients = formData.ingredients.filter(i => i.trim() !== "");
    const instructions = formData.instructions.filter(i => i.trim() !== "");

    if (!formData.title.trim() || !formData.meal.trim() || ingredients.length === 0 || instructions.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    let imageUrl = formData.image || "https://images.unsplash.com/photo-1546548970-71785318a17b";

    if (imageFile) {
      try {
        setIsUploadingImage(true);
        const timestamp = Date.now();
        // Sanitize filename: remove spaces, special chars, keep only alphanumeric, dots, and hyphens
        const sanitizedName = imageFile.name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9.-]/g, '');
        const fileName = `recipe-${timestamp}-${sanitizedName}`;
        const filePath = `recipes/${fileName}`;

        await storageHelpers.uploadFile('recipe-images', filePath, imageFile);
        imageUrl = storageHelpers.getPublicUrl('recipe-images', filePath);
      } catch (error: any) {
        setIsUploadingImage(false);
        
        // Check if it's a bucket not found error
        if (error.message?.includes('Bucket not found') || error.statusCode === '404') {
          toast({
            title: "Storage Bucket Not Found",
            description: "Please create the 'recipe-images' bucket in Supabase Storage. Go to Storage → New Bucket → Name: recipe-images (make it public).",
            variant: "destructive",
            duration: 10000,
          });
        } else {
          toast({
            title: "Upload Error",
            description: error.message || "Failed to upload image",
            variant: "destructive",
          });
        }
        return;
      } finally {
        setIsUploadingImage(false);
      }
    }

    const recipeData = {
      type: formData.type,
      meal: formData.meal,
      title: formData.title,
      description: formData.description,
      image: imageUrl,
      ingredients,
      instructions,
    };

    if (editingRecipe) {
      updateMutation.mutate({ id: editingRecipe.id, data: recipeData });
    } else {
      createMutation.mutate(recipeData);
    }
  };

  const handleDelete = () => {
    if (deleteRecipe) {
      deleteMutation.mutate(deleteRecipe.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Nutrition Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage recipes and meal plans
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-create-recipe">
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
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1" 
                        onClick={() => handleOpenDialog(recipe)}
                        data-testid={`button-edit-recipe-${recipe.id}`}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setDeleteRecipe(recipe)}
                        data-testid={`button-delete-recipe-${recipe.id}`}
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
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleOpenDialog(recipe)}
                        data-testid={`button-edit-weekly-recipe-${recipe.id}`}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setDeleteRecipe(recipe)}
                        data-testid={`button-delete-weekly-recipe-${recipe.id}`}
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

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-recipe-form">
          <DialogHeader>
            <DialogTitle>{editingRecipe ? "Edit Recipe" : "Add Recipe"}</DialogTitle>
            <DialogDescription>
              {editingRecipe ? "Update the recipe details" : "Create a new recipe with ingredients and instructions"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger data-testid="select-recipe-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly Meal Prep</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meal">Meal Category</Label>
                <Input 
                  id="meal" 
                  placeholder="e.g., breakfast, lunch, dinner, snack" 
                  value={formData.meal}
                  onChange={(e) => setFormData(prev => ({ ...prev, meal: e.target.value }))}
                  data-testid="input-recipe-meal" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title" 
                placeholder="Recipe title" 
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                data-testid="input-recipe-title" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Brief description" 
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                data-testid="input-recipe-description" 
              />
            </div>

            <div className="space-y-2">
              <Label>Recipe Image</Label>
              
              {imagePreview ? (
                <div className="relative">
                  <div className="aspect-video w-full rounded-md overflow-hidden border bg-muted">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1546548970-71785318a17b';
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                    data-testid="button-remove-image"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-3">Upload an image or paste a URL</p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => document.getElementById('image-file-input')?.click()}
                      data-testid="button-upload-image"
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      Upload
                    </Button>
                  </div>
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
              
              <div className="space-y-2">
                <Label htmlFor="image" className="text-xs text-muted-foreground">Or paste image URL</Label>
                <Input 
                  id="image" 
                  placeholder="https://..." 
                  value={formData.image}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, image: e.target.value }));
                    if (e.target.value) {
                      setImagePreview(e.target.value);
                    }
                  }}
                  data-testid="input-recipe-image" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Ingredients *</Label>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline"
                  onClick={handleAddIngredient}
                  data-testid="button-add-ingredient"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      placeholder={`Ingredient ${index + 1}`}
                      value={ingredient}
                      onChange={(e) => handleIngredientChange(index, e.target.value)}
                      data-testid={`input-ingredient-${index}`}
                    />
                    {formData.ingredients.length > 1 && (
                      <Button 
                        type="button" 
                        size="icon" 
                        variant="ghost"
                        onClick={() => handleRemoveIngredient(index)}
                        data-testid={`button-remove-ingredient-${index}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Instructions *</Label>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline"
                  onClick={handleAddInstruction}
                  data-testid="button-add-instruction"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea 
                      placeholder={`Step ${index + 1}`}
                      value={instruction}
                      onChange={(e) => handleInstructionChange(index, e.target.value)}
                      rows={2}
                      data-testid={`input-instruction-${index}`}
                    />
                    {formData.instructions.length > 1 && (
                      <Button 
                        type="button" 
                        size="icon" 
                        variant="ghost"
                        onClick={() => handleRemoveInstruction(index)}
                        data-testid={`button-remove-instruction-${index}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} data-testid="button-cancel">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={createMutation.isPending || updateMutation.isPending || isUploadingImage}
              data-testid="button-save-recipe"
            >
              {isUploadingImage ? "Uploading..." : (createMutation.isPending || updateMutation.isPending ? "Saving..." : (editingRecipe ? "Update" : "Create"))}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteRecipe} onOpenChange={() => setDeleteRecipe(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteRecipe?.title}"? This action cannot be undone.
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
