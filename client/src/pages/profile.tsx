import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { userQueries, storageHelpers } from "@/lib/supabase-queries";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, User as UserIcon, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Profile() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    age: "",
    height: "",
    weight: "",
    recipePreference: "",
    avatarUrl: "",
  });

  const { toast } = useToast();

  // Get current user ID
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    });
  }, []);

  // Fetch user profile
  const { data: user, isLoading } = useQuery({
    queryKey: ['/users', userId],
    queryFn: () => userQueries.getById(userId!),
    enabled: !!userId,
  });

  // Update form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        email: user.email || "",
        age: user.age || "",
        height: user.height || "",
        weight: user.weight || "",
        recipePreference: user.recipePreference || "",
        avatarUrl: user.avatarUrl || "",
      });
      if (user.avatarUrl) {
        setAvatarPreview(user.avatarUrl);
      }
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<typeof formData>) => 
      userQueries.update(userId!, updates as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/users', userId] });
      queryClient.invalidateQueries({ queryKey: ['/users'] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      let avatarUrl = formData.avatarUrl;

      // Upload new avatar if selected
      if (avatarFile) {
        setIsUploadingAvatar(true);
        const fileName = `${userId}-${Date.now()}-${avatarFile.name}`;
        await storageHelpers.uploadFile('user-avatars', fileName, avatarFile);
        avatarUrl = storageHelpers.getPublicUrl('user-avatars', fileName);
        setIsUploadingAvatar(false);
      }

      await updateMutation.mutateAsync({
        displayName: formData.displayName,
        age: formData.age,
        height: formData.height,
        weight: formData.weight,
        recipePreference: formData.recipePreference,
        avatarUrl,
      });
    } catch (error: any) {
      setIsUploadingAvatar(false);
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        email: user.email || "",
        age: user.age || "",
        height: user.height || "",
        weight: user.weight || "",
        recipePreference: user.recipePreference || "",
        avatarUrl: user.avatarUrl || "",
      });
      setAvatarPreview(user.avatarUrl || "");
      setAvatarFile(null);
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">User profile not found</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your personal information and preferences
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} data-testid="button-edit-profile">
            Edit Profile
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            {isEditing ? "Update your profile details" : "Your profile information"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarPreview || user.avatarUrl || ""} />
                <AvatarFallback className="text-2xl">
                  {formData.displayName ? getInitials(formData.displayName) : <UserIcon className="h-10 w-10" />}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  onClick={() => document.getElementById('avatar-input')?.click()}
                  data-testid="button-change-avatar"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                data-testid="input-avatar"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{user.displayName || "No name set"}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground capitalize">{user.role || "user"}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                disabled={!isEditing}
                data-testid="input-display-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email}
                disabled
                className="bg-muted"
                data-testid="input-email"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                disabled={!isEditing}
                placeholder="e.g., 25"
                data-testid="input-age"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                value={formData.height}
                onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                disabled={!isEditing}
                placeholder="e.g., 5'10&quot; or 178 cm"
                data-testid="input-height"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                disabled={!isEditing}
                placeholder="e.g., 180 lbs or 82 kg"
                data-testid="input-weight"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipePreference">Recipe Preference</Label>
              {isEditing ? (
                <Select
                  value={formData.recipePreference}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, recipePreference: value }))}
                >
                  <SelectTrigger id="recipePreference" data-testid="select-recipe-preference">
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="high-protein">High Protein</SelectItem>
                    <SelectItem value="low-carb">Low Carb</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="keto">Keto</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="recipePreference"
                  value={formData.recipePreference || "Not set"}
                  disabled
                  className="bg-muted capitalize"
                  data-testid="input-recipe-preference-display"
                />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending || isUploadingAvatar}
                data-testid="button-save-profile"
              >
                <Save className="h-4 w-4 mr-2" />
                {isUploadingAvatar ? "Uploading..." : (updateMutation.isPending ? "Saving..." : "Save Changes")}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={updateMutation.isPending || isUploadingAvatar}
                data-testid="button-cancel-profile"
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details and role</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">User ID</Label>
              <p className="text-sm font-mono mt-1">{user.id}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Role</Label>
              <p className="text-sm mt-1 capitalize">{user.role || "user"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Member Since</Label>
              <p className="text-sm mt-1">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Last Updated</Label>
              <p className="text-sm mt-1">
                {new Date(user.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
