import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const mockUsers: User[] = [
    { id: "1", name: "Sarah Johnson", email: "sarah.j@example.com", role: "admin", status: "active" },
    { id: "2", name: "Mike Chen", email: "mike.c@example.com", role: "coach", status: "active" },
    { id: "3", name: "Emma Davis", email: "emma.d@example.com", role: "user", status: "active" },
    { id: "4", name: "Alex Kim", email: "alex.k@example.com", role: "user", status: "inactive" },
    { id: "5", name: "Jordan Lee", email: "jordan.l@example.com", role: "coach", status: "active" },
  ];

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    console.log("Delete user:", user.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-page-title">Users</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        <Button onClick={handleCreate} data-testid="button-create-user" className="bg-primary hover:bg-primary-700">
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
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
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
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white" data-testid={`text-user-name-${user.id}`}>
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.status === "active" ? "outline" : "secondary"} className="capitalize">
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                          data-testid={`button-edit-${user.id}`}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user)}
                          data-testid={`button-delete-${user.id}`}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent data-testid="dialog-user-form">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Create New User"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Update user information" : "Add a new user to the system"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="John Doe" defaultValue={editingUser?.name} data-testid="input-user-name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" defaultValue={editingUser?.email} data-testid="input-user-email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select defaultValue={editingUser?.role || "user"}>
                <SelectTrigger data-testid="select-user-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="coach">Coach</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={editingUser?.status || "active"}>
                <SelectTrigger data-testid="select-user-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)} data-testid="button-save-user">
              {editingUser ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
