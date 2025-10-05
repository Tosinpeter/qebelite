import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Upload, X } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";
import { supabase } from "@/lib/supabase";

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    displayName: "",
    role: "user",
    password: "",
    avatarUrl: "",
    age: "",
    weight: "",
  });

  const { toast } = useToast();

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest("POST", "/api/users", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "User created successfully" });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      apiRequest("PATCH", `/api/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "User updated successfully" });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "User deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const filteredUsers = users.filter(user =>
    (user.displayName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      email: "",
      displayName: "",
      role: "user",
      password: "",
      avatarUrl: "",
      age: "",
      weight: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email || "",
      displayName: user.displayName || "",
      role: user.role || "user",
      password: "",
      avatarUrl: user.avatarUrl || "",
      age: user.age || "",
      weight: user.weight || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    if (confirm(`Are you sure you want to delete ${user.displayName || user.id}?`)) {
      deleteMutation.mutate(user.id);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      let uploadData;
      let uploadError;

      const { data, error } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      uploadData = data;
      uploadError = error;

      if (uploadError) {
        if (uploadError.message.includes('Bucket not found') || uploadError.message.includes('not found')) {
          const { error: bucketError } = await supabase.storage.createBucket('user-avatars', {
            public: true,
            fileSizeLimit: 5242880
          });

          if (bucketError && !bucketError.message.includes('already exists')) {
            console.error('Bucket creation error:', bucketError);
          }

          const { data: retryData, error: retryError } = await supabase.storage
            .from('user-avatars')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (retryError) {
            console.error('Retry upload error:', retryError);
            throw retryError;
          }

          uploadData = retryData;
          uploadError = null;
        } else {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }
      }

      if (uploadData) {
        setUploadProgress(100);
        const { data: { publicUrl } } = supabase.storage
          .from('user-avatars')
          .getPublicUrl(uploadData.path);

        setFormData({ ...formData, avatarUrl: publicUrl });
        toast({
          title: "Upload successful",
          description: "Avatar uploaded successfully",
        });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      clearInterval(progressInterval);
      setUploadProgress(0);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload avatar",
      });
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleSave = async () => {
    if (editingUser) {
      updateMutation.mutate({
        id: editingUser.id,
        data: formData,
      });
    } else {
      try {
        if (!formData.email || !formData.password) {
          toast({
            variant: "destructive",
            title: "Missing required fields",
            description: "Email and password are required",
          });
          return;
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              display_name: formData.displayName,
            }
          }
        });

        if (authError) {
          let errorMessage = authError.message;
          if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
            errorMessage = `A user with email ${formData.email} is already registered`;
          }
          throw new Error(errorMessage);
        }
        
        if (authData.user) {
          createMutation.mutate({
            id: authData.user.id,
            email: formData.email,
            displayName: formData.displayName,
            role: formData.role,
            avatarUrl: formData.avatarUrl,
            age: formData.age,
            weight: formData.weight,
          });
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error creating user",
          description: error.message || "Failed to create user",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-page-title">Users</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage user profiles and preferences
          </p>
        </div>
        <Button onClick={handleCreate} data-testid="button-create-user">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-users"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Age</th>
                  <th className="px-6 py-3">Weight</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    data-testid={`user-row-${user.id}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatarUrl || undefined} alt={user.displayName || "User"} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-900 dark:text-white" data-testid={`text-user-name-${user.id}`}>
                          {user.displayName || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {user.email || user.id}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role || "user"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {user.age || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {user.weight || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(user)}
                          data-testid={`button-edit-${user.id}`}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user)}
                          data-testid={`button-delete-${user.id}`}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent data-testid="dialog-user-form">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User Profile" : "Create New User"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Update user profile information" : "Add a new user to the system"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3">
              <div 
                className="relative cursor-pointer group"
                onClick={() => !isUploading && document.getElementById('avatar-file-upload')?.click()}
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  {formData.avatarUrl ? (
                    <img 
                      src={formData.avatarUrl} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                {!isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                )}
                {formData.avatarUrl && !isUploading && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData({ ...formData, avatarUrl: "" });
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
                <input
                  id="avatar-file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={isUploading}
                  data-testid="input-avatar-file-upload"
                />
              </div>
              {isUploading && (
                <div className="w-full max-w-xs">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-center text-gray-500 mt-1">Uploading... {uploadProgress}%</p>
                </div>
              )}
            </div>
            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="user@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  data-testid="input-user-email" 
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input 
                id="displayName" 
                placeholder="John Doe" 
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                data-testid="input-user-displayname" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger data-testid="select-user-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  placeholder="Enter password" 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  data-testid="input-user-password" 
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={updateMutation.isPending || createMutation.isPending}
              data-testid="button-save-user"
            >
              {updateMutation.isPending || createMutation.isPending ? "Saving..." : editingUser ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
