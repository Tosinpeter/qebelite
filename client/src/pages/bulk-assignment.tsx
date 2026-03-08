import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Dumbbell, Utensils, Plus, Trash2, Check, X, Users } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { 
  userQueries, 
  recipeQueries, 
  weightRoomVideoQueries,
  plannedWorkoutQueries, 
  plannedMealQueries 
} from "@/lib/supabase-queries";
import { supabase } from "@/lib/supabase";
import type { User, Recipe, WeightRoomVideo } from "@shared/schema";

export default function BulkAssignment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isWorkoutDialogOpen, setIsWorkoutDialogOpen] = useState(false);
  const [isMealDialogOpen, setIsMealDialogOpen] = useState(false);
  const { toast } = useToast();

  // Workout form state
  const [workoutForm, setWorkoutForm] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    exercises: [] as Array<{
      videoId: string;
      exerciseName: string;
      sets: number;
      reps: number;
      weight: string;
      time: string;
      notes: string;
      sortOrder: number;
    }>,
  });

  // Meal form state
  const [mealForm, setMealForm] = useState({
    recipeId: "",
    date: new Date().toISOString().split('T')[0],
  });

  // Fetch users
  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['profiles'],
    queryFn: userQueries.getAll,
  });

  // Fetch recipes
  const { data: recipes = [], isLoading: recipesLoading } = useQuery<Recipe[]>({
    queryKey: ['recipes'],
    queryFn: recipeQueries.getAll,
  });

  // Fetch workout videos
  const { data: videos = [], isLoading: videosLoading } = useQuery<WeightRoomVideo[]>({
    queryKey: ['weight_room_videos'],
    queryFn: weightRoomVideoQueries.getAll,
  });

  // Mutations
  const bulkWorkoutMutation = useMutation({
    mutationFn: async () => {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error("Not authenticated");
      
      return plannedWorkoutQueries.bulkCreateWorkoutsForUsers({
        userIds: selectedUsers,
        title: workoutForm.title,
        description: workoutForm.description,
        date: workoutForm.date,
        assignedBy: currentUser.user.id,
        exercises: workoutForm.exercises,
      });
    },
    onSuccess: (results) => {
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;
      
      toast({
        title: "Workouts Assigned",
        description: `Successfully assigned to ${successCount} users. ${failCount > 0 ? `${failCount} failed.` : ''}`,
      });
      
      setIsWorkoutDialogOpen(false);
      setSelectedUsers([]);
      setWorkoutForm({
        title: "",
        description: "",
        date: new Date().toISOString().split('T')[0],
        exercises: [],
      });
      queryClient.invalidateQueries({ queryKey: ['planned_workouts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const bulkMealMutation = useMutation({
    mutationFn: () => plannedMealQueries.bulkAddMealsForUsers({
      userIds: selectedUsers,
      recipeId: mealForm.recipeId,
      date: mealForm.date,
    }),
    onSuccess: (results) => {
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;
      
      toast({
        title: "Meals Assigned",
        description: `Successfully assigned to ${successCount} users. ${failCount > 0 ? `${failCount} failed (may already exist).` : ''}`,
      });
      
      setIsMealDialogOpen(false);
      setSelectedUsers([]);
      setMealForm({
        recipeId: "",
        date: new Date().toISOString().split('T')[0],
      });
      queryClient.invalidateQueries({ queryKey: ['planned_meals'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter users
  const filteredUsers = users.filter((user: User) => {
    const query = searchQuery.toLowerCase();
    return (
      user.displayName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.id.toLowerCase().includes(query)
    );
  });

  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Select all filtered users
  const selectAllUsers = () => {
    const filteredIds = filteredUsers.map((u: User) => u.id);
    const allSelected = filteredIds.every(id => selectedUsers.includes(id));
    
    if (allSelected) {
      setSelectedUsers(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedUsers(prev => [...new Set([...prev, ...filteredIds])]);
    }
  };

  // Add exercise to workout
  const addExercise = () => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          videoId: "",
          exerciseName: "",
          sets: 3,
          reps: 10,
          weight: "",
          time: "",
          notes: "",
          sortOrder: prev.exercises.length,
        },
      ],
    }));
  };

  // Update exercise
  const updateExercise = (index: number, field: string, value: any) => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => 
        i === index ? { ...ex, [field]: value } : ex
      ),
    }));
  };

  // Remove exercise
  const removeExercise = (index: number) => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  // Handle video selection for exercise
  const handleVideoSelect = (index: number, videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    updateExercise(index, 'videoId', videoId);
    if (video) {
      updateExercise(index, 'exerciseName', video.title);
    }
  };

  if (usersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bulk Assignment</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Assign workouts and meals to multiple users at once
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap">
        <Button 
          onClick={() => setIsWorkoutDialogOpen(true)}
          disabled={selectedUsers.length === 0}
          className="flex items-center gap-2"
        >
          <Dumbbell className="h-4 w-4" />
          Assign Workout ({selectedUsers.length})
        </Button>
        <Button 
          onClick={() => setIsMealDialogOpen(true)}
          disabled={selectedUsers.length === 0}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Utensils className="h-4 w-4" />
          Assign Meal ({selectedUsers.length})
        </Button>
        {selectedUsers.length > 0 && (
          <Button 
            variant="ghost" 
            onClick={() => setSelectedUsers([])}
            className="text-gray-500"
          >
            Clear Selection
          </Button>
        )}
      </div>

      {/* User Selection */}
      <Card>
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Select Users</CardTitle>
              <CardDescription>
                {selectedUsers.length} of {users.length} users selected
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={selectAllUsers}>
              <Users className="h-4 w-4 mr-2" />
              {filteredUsers.every((u: User) => selectedUsers.includes(u.id)) 
                ? 'Deselect All' 
                : 'Select All'}
            </Button>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700 sticky top-0">
                <tr>
                  <th className="px-6 py-3 w-12">
                    <Checkbox 
                      checked={filteredUsers.length > 0 && filteredUsers.every((u: User) => selectedUsers.includes(u.id))}
                      onCheckedChange={selectAllUsers}
                    />
                  </th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user: User) => (
                  <tr
                    key={user.id}
                    className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                      selectedUsers.includes(user.id) ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => toggleUserSelection(user.id)}
                  >
                    <td className="px-6 py-4">
                      <Checkbox 
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl || undefined} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {user.displayName?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {user.displayName || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {user.email || user.id.substring(0, 8) + "..."}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role || "user"}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Workout Assignment Dialog */}
      <Dialog open={isWorkoutDialogOpen} onOpenChange={setIsWorkoutDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Workout</DialogTitle>
            <DialogDescription>
              Create a workout and assign it to {selectedUsers.length} selected user(s)
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workout-title">Workout Title</Label>
                <Input
                  id="workout-title"
                  value={workoutForm.title}
                  onChange={(e) => setWorkoutForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Upper Body Strength"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workout-date">Date</Label>
                <Input
                  id="workout-date"
                  type="date"
                  value={workoutForm.date}
                  onChange={(e) => setWorkoutForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workout-description">Description (Optional)</Label>
              <Textarea
                id="workout-description"
                value={workoutForm.description}
                onChange={(e) => setWorkoutForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Workout description..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Exercises</Label>
                <Button type="button" variant="outline" size="sm" onClick={addExercise}>
                  <Plus className="h-4 w-4 mr-1" /> Add Exercise
                </Button>
              </div>
              
              {workoutForm.exercises.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <Dumbbell className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">No exercises added yet</p>
                  <Button type="button" variant="link" size="sm" onClick={addExercise}>
                    Add your first exercise
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {workoutForm.exercises.map((exercise, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-4">
                        <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          {index + 1}
                        </span>
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Video</Label>
                              <Select 
                                value={exercise.videoId} 
                                onValueChange={(val) => handleVideoSelect(index, val)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select video" />
                                </SelectTrigger>
                                <SelectContent>
                                  {videos.map((video: WeightRoomVideo) => (
                                    <SelectItem key={video.id} value={video.id}>
                                      {video.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Exercise Name</Label>
                              <Input
                                value={exercise.exerciseName}
                                onChange={(e) => updateExercise(index, 'exerciseName', e.target.value)}
                                placeholder="Exercise name"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Sets</Label>
                              <Input
                                type="number"
                                value={exercise.sets}
                                onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Reps</Label>
                              <Input
                                type="number"
                                value={exercise.reps}
                                onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 0)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Weight</Label>
                              <Input
                                value={exercise.weight}
                                onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                                placeholder="e.g., 135 lbs"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Time</Label>
                              <Input
                                value={exercise.time}
                                onChange={(e) => updateExercise(index, 'time', e.target.value)}
                                placeholder="e.g., 30 sec"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Notes</Label>
                            <Input
                              value={exercise.notes}
                              onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                              placeholder="Optional notes for this exercise"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => removeExercise(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWorkoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => bulkWorkoutMutation.mutate()}
              disabled={!workoutForm.title || bulkWorkoutMutation.isPending}
            >
              {bulkWorkoutMutation.isPending ? "Assigning..." : `Assign to ${selectedUsers.length} Users`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Meal Assignment Dialog */}
      <Dialog open={isMealDialogOpen} onOpenChange={setIsMealDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Meal</DialogTitle>
            <DialogDescription>
              Add a meal to the calendar for {selectedUsers.length} selected user(s)
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meal-recipe">Recipe</Label>
              <Select 
                value={mealForm.recipeId} 
                onValueChange={(val) => setMealForm(prev => ({ ...prev, recipeId: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a recipe" />
                </SelectTrigger>
                <SelectContent>
                  {recipes.map((recipe: Recipe) => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      <div className="flex items-center gap-2">
                        {recipe.image && (
                          <img 
                            src={recipe.image} 
                            alt={recipe.title}
                            className="h-6 w-6 rounded object-cover"
                          />
                        )}
                        <span>{recipe.title}</span>
                        {recipe.meal && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {recipe.meal}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meal-date">Date</Label>
              <Input
                id="meal-date"
                type="date"
                value={mealForm.date}
                onChange={(e) => setMealForm(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMealDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => bulkMealMutation.mutate()}
              disabled={!mealForm.recipeId || bulkMealMutation.isPending}
            >
              {bulkMealMutation.isPending ? "Assigning..." : `Assign to ${selectedUsers.length} Users`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
