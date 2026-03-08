import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Trophy,
  TrendingUp,
  Users,
  Settings,
  Plus,
  Minus,
  History,
  Save,
  ArrowUpRight,
  ArrowDownRight,
  Gift,
  Edit,
  Trash2,
  TicketCheck,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
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
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import {
  userPointsQueries,
  pointsConfigQueries,
  redemptionOptionsQueries,
  type UserPointsWithProfile,
} from "@/lib/supabase-queries";
import type { PointsConfigEntry, RedemptionOption } from "@shared/schema";

function StatsCards({ users }: { users: UserPointsWithProfile[] }) {
  const totalPointsInCirculation = users.reduce((sum, u) => sum + u.totalPoints, 0);
  const totalLifetimePoints = users.reduce((sum, u) => sum + u.lifetimePoints, 0);
  const usersWithPoints = users.filter((u) => u.totalPoints > 0).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Points in Circulation</p>
              <p className="text-2xl font-bold">{totalPointsInCirculation.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lifetime Points Earned</p>
              <p className="text-2xl font-bold">{totalLifetimePoints.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Users with Points</p>
              <p className="text-2xl font-bold">
                {usersWithPoints} <span className="text-sm font-normal text-muted-foreground">/ {users.length}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TransactionHistoryDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserPointsWithProfile | null;
}) {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["points-transactions", user?.userId],
    queryFn: () => userPointsQueries.getTransactionsByUser(user!.userId),
    enabled: open && !!user?.userId,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Transaction History</DialogTitle>
          <DialogDescription>
            {user?.displayName || user?.email || "User"} — {user?.totalPoints ?? 0} current points
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[50vh]">
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No transactions found</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs uppercase bg-muted/50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx: any) => (
                  <tr key={tx.id} className="border-b border-muted">
                    <td className="px-4 py-2 text-muted-foreground whitespace-nowrap">
                      {new Date(tx.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-2">
                      <Badge
                        variant={
                          tx.transactionType === "earn"
                            ? "default"
                            : tx.transactionType === "admin_adjustment"
                              ? "outline"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {tx.transactionType === "earn"
                          ? "Earned"
                          : tx.transactionType === "redeem"
                            ? "Redeemed"
                            : "Admin"}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {tx.description || tx.contentTitle || "—"}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      <span className={tx.points >= 0 ? "text-green-600" : "text-red-600"}>
                        {tx.points >= 0 ? "+" : ""}
                        {tx.points}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AdjustPointsDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserPointsWithProfile | null;
}) {
  const [adjustType, setAdjustType] = useState<"add" | "subtract">("add");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const adjustMutation = useMutation({
    mutationFn: (params: { userId: string; points: number; description: string }) =>
      userPointsQueries.adjustPoints(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-points"] });
      queryClient.invalidateQueries({ queryKey: ["points-transactions"] });
      toast({ title: "Points adjusted successfully" });
      onOpenChange(false);
      setAmount("");
      setDescription("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    const pts = parseInt(amount);
    if (!pts || pts <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a positive number",
        variant: "destructive",
      });
      return;
    }
    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please provide a reason for the adjustment",
        variant: "destructive",
      });
      return;
    }
    adjustMutation.mutate({
      userId: user!.userId,
      points: adjustType === "add" ? pts : -pts,
      description: description.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Points</DialogTitle>
          <DialogDescription>
            {user?.displayName || user?.email || "User"} — Current balance:{" "}
            <strong>{user?.totalPoints ?? 0}</strong> points
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Adjustment Type</Label>
            <Select value={adjustType} onValueChange={(v) => setAdjustType(v as "add" | "subtract")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">
                  <span className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-green-600" /> Add Points
                  </span>
                </SelectItem>
                <SelectItem value="subtract">
                  <span className="flex items-center gap-2">
                    <Minus className="h-4 w-4 text-red-600" /> Subtract Points
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              min="1"
              placeholder="Enter points amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {amount && parseInt(amount) > 0 && (
              <p className="text-xs text-muted-foreground">
                New balance will be:{" "}
                <strong>
                  {Math.max(
                    0,
                    (user?.totalPoints ?? 0) +
                      (adjustType === "add" ? parseInt(amount) : -parseInt(amount))
                  )}
                </strong>{" "}
                points
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Reason</Label>
            <Textarea
              placeholder="Reason for adjustment (e.g., manual correction, bonus reward)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={adjustMutation.isPending}>
            {adjustMutation.isPending ? "Saving..." : "Apply Adjustment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UserPointsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "points" | "lifetime">("points");
  const [historyUser, setHistoryUser] = useState<UserPointsWithProfile | null>(null);
  const [adjustUser, setAdjustUser] = useState<UserPointsWithProfile | null>(null);

  const { data: users = [], isLoading } = useQuery<UserPointsWithProfile[]>({
    queryKey: ["user-points"],
    queryFn: userPointsQueries.getAllWithProfiles,
  });

  const filtered = users
    .filter((u) => {
      const q = searchQuery.toLowerCase();
      return (
        u.displayName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.userId.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "points") return b.totalPoints - a.totalPoints;
      if (sortBy === "lifetime") return b.lifetimePoints - a.lifetimePoints;
      return (a.displayName || "").localeCompare(b.displayName || "");
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading user points...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StatsCards users={users} />

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="points">Sort by Current Points</SelectItem>
                <SelectItem value="lifetime">Sort by Lifetime Points</SelectItem>
                <SelectItem value="name">Sort by Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3 text-right">Current Points</th>
                  <th className="px-6 py-3 text-right">Lifetime Points</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr
                    key={user.userId}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl || undefined} />
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.displayName || "—"}
                          </div>
                          <div className="text-xs text-muted-foreground">{user.email || user.userId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {user.totalPoints.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      {user.lifetimePoints.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setHistoryUser(user)}
                          title="View transaction history"
                        >
                          <History className="h-4 w-4 mr-1" />
                          History
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAdjustUser(user)}
                          title="Adjust points"
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Adjust
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
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

      <TransactionHistoryDialog
        open={!!historyUser}
        onOpenChange={(open) => !open && setHistoryUser(null)}
        user={historyUser}
      />
      <AdjustPointsDialog
        open={!!adjustUser}
        onOpenChange={(open) => !open && setAdjustUser(null)}
        user={adjustUser}
      />
    </div>
  );
}

function PointsConfigTab() {
  const { toast } = useToast();
  const [configValues, setConfigValues] = useState<Record<string, { points: string; label: string }>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const { data: config = [], isLoading } = useQuery<PointsConfigEntry[]>({
    queryKey: ["points-config"],
    queryFn: async () => {
      await pointsConfigQueries.seedDefaults();
      return pointsConfigQueries.getAll();
    },
  });

  useEffect(() => {
    if (config.length > 0 && Object.keys(configValues).length === 0) {
      const values: Record<string, { points: string; label: string }> = {};
      config.forEach((c) => {
        values[c.activityType] = {
          points: String(c.pointsValue),
          label: c.label,
        };
      });
      setConfigValues(values);
    }
  }, [config]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const entries = Object.entries(configValues);
      for (const [activityType, { points, label }] of entries) {
        const pointsValue = parseInt(points);
        if (isNaN(pointsValue) || pointsValue < 0) continue;
        await pointsConfigQueries.upsert({ activityType, pointsValue, label });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["points-config"] });
      toast({ title: "Points configuration saved" });
      setHasChanges(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const activityIcons: Record<string, { icon: typeof Trophy; color: string }> = {
    video: { icon: ArrowUpRight, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
    recipe: { icon: ArrowUpRight, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
    workout: { icon: ArrowUpRight, color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30" },
    huddle: { icon: ArrowUpRight, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" },
  };

  const updateValue = (activityType: string, field: "points" | "label", value: string) => {
    setConfigValues((prev) => ({
      ...prev,
      [activityType]: { ...prev[activityType], [field]: value },
    }));
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Activity Point Values</CardTitle>
              <CardDescription className="mt-1">
                Configure how many points users earn for each activity in the app
              </CardDescription>
            </div>
            <Button onClick={() => saveMutation.mutate()} disabled={!hasChanges || saveMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {saveMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(configValues).map(([activityType, { points, label }]) => {
              const style = activityIcons[activityType] || {
                icon: ArrowUpRight,
                color: "text-gray-600 bg-gray-100",
              };
              const Icon = style.icon;

              return (
                <Card key={activityType} className="border">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${style.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                            Activity Label
                          </Label>
                          <Input
                            value={label}
                            onChange={(e) => updateValue(activityType, "label", e.target.value)}
                            placeholder="Activity label"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                            Points Earned
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              value={points}
                              onChange={(e) => updateValue(activityType, "points", e.target.value)}
                              className="w-28"
                            />
                            <span className="text-sm text-muted-foreground">pts</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Type: <code className="bg-muted px-1 py-0.5 rounded">{activityType}</code>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const REWARD_ICON_OPTIONS = [
  { value: "shopping_bag", label: "Shopping bag" },
  { value: "fitness_center", label: "Fitness / Dumbbell" },
  { value: "sports", label: "Sports" },
  { value: "card_giftcard", label: "Gift card" },
  { value: "local_offer", label: "Offer / Tag" },
  { value: "confirmation_number", label: "Ticket" },
] as const;

const defaultRewardForm = {
  title: "",
  description: "",
  pointsCost: 0,
  rewardType: "merch_discount",
  discountCode: "",
  discountPercentage: null as number | null,
  isActive: true,
  quantityAvailable: null as number | null,
  sortOrder: 0,
  iconName: "card_giftcard",
};

function RewardFormDialog({
  open,
  onOpenChange,
  reward,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reward: RedemptionOption | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(defaultRewardForm);
  const { toast } = useToast();

  useEffect(() => {
    if (reward) {
      setForm({
        title: reward.title,
        description: reward.description ?? "",
        pointsCost: reward.pointsCost ?? 0,
        rewardType: reward.rewardType ?? "merch_discount",
        discountCode: reward.discountCode ?? "",
        discountPercentage: reward.discountPercentage ?? null,
        isActive: reward.isActive ?? true,
        quantityAvailable: reward.quantityAvailable ?? null,
        sortOrder: reward.sortOrder ?? 0,
        iconName: reward.iconName ?? "card_giftcard",
      });
    } else {
      setForm(defaultRewardForm);
    }
  }, [reward, open]);

  const createMutation = useMutation({
    mutationFn: (data: Partial<RedemptionOption>) => redemptionOptionsQueries.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["redemption-options"] });
      toast({ title: "Reward created" });
      onSaved();
      onOpenChange(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RedemptionOption> }) =>
      redemptionOptionsQueries.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["redemption-options"] });
      toast({ title: "Reward updated" });
      onSaved();
      onOpenChange(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const handleSubmit = () => {
    if (!form.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    const payload: Partial<RedemptionOption> = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      pointsCost: form.pointsCost,
      rewardType: form.rewardType,
      discountCode: form.discountCode.trim() || null,
      discountPercentage: form.discountPercentage ?? null,
      isActive: form.isActive,
      quantityAvailable: form.quantityAvailable ?? null,
      sortOrder: form.sortOrder,
      iconName: form.iconName || null,
    };
    if (reward) {
      updateMutation.mutate({ id: reward.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{reward ? "Edit Reward" : "Add Reward"}</DialogTitle>
          <DialogDescription>
            {reward ? "Update redemption reward details" : "Create a new reward users can redeem with points"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. 10% Off Merch"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Short description for users"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Points cost</Label>
              <Input
                type="number"
                min={0}
                value={form.pointsCost || ""}
                onChange={(e) => setForm((f) => ({ ...f, pointsCost: parseInt(e.target.value, 10) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Reward type</Label>
              <Select
                value={form.rewardType}
                onValueChange={(v) => setForm((f) => ({ ...f, rewardType: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="merch_discount">Merch discount</SelectItem>
                  <SelectItem value="training_discount">Training discount</SelectItem>
                  <SelectItem value="camp_discount">Camp discount</SelectItem>
                  <SelectItem value="merch_free">Free merch</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Discount % (optional)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={form.discountPercentage ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    discountPercentage: e.target.value === "" ? null : parseInt(e.target.value, 10),
                  }))
               }
              />
            </div>
            <div className="space-y-2">
              <Label>Discount code (optional)</Label>
              <Input
                value={form.discountCode}
                onChange={(e) => setForm((f) => ({ ...f, discountCode: e.target.value }))}
                placeholder="e.g. QBELITE10"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quantity available (optional)</Label>
              <Input
                type="number"
                min={0}
                value={form.quantityAvailable ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    quantityAvailable: e.target.value === "" ? null : parseInt(e.target.value, 10),
                  }))
                }
                placeholder="Unlimited if empty"
              />
            </div>
            <div className="space-y-2">
              <Label>Sort order</Label>
              <Input
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value, 10) || 0 }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Icon (app reward card)</Label>
            <Select
              value={form.iconName}
              onValueChange={(v) => setForm((f) => ({ ...f, iconName: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose icon" />
              </SelectTrigger>
              <SelectContent>
                {REWARD_ICON_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Active</Label>
            <Switch checked={form.isActive} onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {reward ? "Save changes" : "Create reward"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RewardsTab() {
  const [editingReward, setEditingReward] = useState<RedemptionOption | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: rewards = [], isLoading } = useQuery({
    queryKey: ["redemption-options"],
    queryFn: redemptionOptionsQueries.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => redemptionOptionsQueries.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["redemption-options"] });
      setDeleteId(null);
    },
    onError: (e: any) => {
      setDeleteId(null);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading rewards...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Redemption rewards</CardTitle>
            <CardDescription className="mt-1">
              Rewards users can redeem with their points. Edit or add new rewards.
            </CardDescription>
          </div>
          <Button onClick={() => { setEditingReward(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add reward
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Points</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Icon</th>
                  <th className="px-6 py-3">Discount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{r.title}</div>
                        {r.description && (
                          <div className="text-xs text-muted-foreground line-clamp-1">{r.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{r.pointsCost?.toLocaleString() ?? 0}</td>
                    <td className="px-6 py-4 text-muted-foreground">{r.rewardType ?? "—"}</td>
                    <td className="px-6 py-4 text-muted-foreground">{r.iconName ?? "—"}</td>
                    <td className="px-6 py-4">
                      {r.discountPercentage != null ? `${r.discountPercentage}%` : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={r.isActive ? "default" : "secondary"}>
                        {r.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setEditingReward(r); setFormOpen(true); }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => setDeleteId(r.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rewards.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No rewards yet. Add one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <RewardFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        reward={editingReward}
        onSaved={() => setEditingReward(null)}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete reward?</AlertDialogTitle>
            <AlertDialogDescription>
              This reward will be removed. Users will no longer see it in the app.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const ALL_REWARDS_FILTER = "__all__";

const REDEMPTION_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

function RedemptionsTab() {
  const [filterByReward, setFilterByReward] = useState<string>(ALL_REWARDS_FILTER);
  const { toast } = useToast();

  const { data: rewards = [] } = useQuery({
    queryKey: ["redemption-options"],
    queryFn: redemptionOptionsQueries.getAll,
  });

  const { data: redemptions = [], isLoading } = useQuery({
    queryKey: ["redemptions", filterByReward],
    queryFn: () =>
      userPointsQueries.getRedemptions(
        filterByReward === ALL_REWARDS_FILTER ? undefined : filterByReward
      ),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      userId,
      rewardTitle,
    }: {
      id: string;
      status: "pending" | "completed" | "cancelled";
      userId: string;
      rewardTitle: string;
    }) =>
      userPointsQueries.updateRedemptionStatus(id, status, { userId, rewardTitle }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["redemptions"] });
      queryClient.invalidateQueries({ queryKey: ["user-points"] });
      const msg =
        variables.status === "completed"
          ? "Status updated. User will be notified."
          : variables.status === "cancelled"
            ? "Status updated. Points have been refunded."
            : "Status updated.";
      toast({ title: msg });
    },
    onError: (e: any) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading redemptions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Users who redeemed rewards</CardTitle>
          <CardDescription className="mt-1">
            See which users redeemed which reward and mark when you have processed the reward
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="flex-1 max-w-xs">
              <Label className="text-xs text-muted-foreground">Filter by reward</Label>
              <Select value={filterByReward} onValueChange={setFilterByReward}>
                <SelectTrigger>
                  <SelectValue placeholder="All rewards" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_REWARDS_FILTER}>All rewards</SelectItem>
                  {rewards.map((r) => (
                    <SelectItem key={r.id} value={r.title ?? ""}>
                      {r.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Reward</th>
                  <th className="px-6 py-3 text-right">Points spent</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {redemptions.map((r: any) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {r.displayName || "—"}
                        </div>
                        <div className="text-xs text-muted-foreground">{r.email || r.userId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{r.rewardTitle ?? "—"}</td>
                    <td className="px-6 py-4 text-right">{r.pointsSpent?.toLocaleString() ?? 0}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{r.redemptionCode ?? "—"}</td>
                    <td className="px-6 py-4">
                      <Select
                        value={r.redemptionStatus ?? "pending"}
                        onValueChange={(value) =>
                          updateStatusMutation.mutate({
                            id: r.id,
                            status: value as "pending" | "completed" | "cancelled",
                            userId: r.userId,
                            rewardTitle: r.rewardTitle ?? "Reward",
                          })
                        }
                        disabled={updateStatusMutation.isPending}
                      >
                        <SelectTrigger className="w-[130px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {REDEMPTION_STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
                {redemptions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No redemptions yet
                      {filterByReward !== ALL_REWARDS_FILTER ? " for this reward" : ""}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PointsManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Points Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          View user points, adjust balances, configure activities, and manage rewards
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            User Points
          </TabsTrigger>
          <TabsTrigger value="config">
            <Settings className="h-4 w-4 mr-2" />
            Points Config
          </TabsTrigger>
          <TabsTrigger value="rewards">
            <Gift className="h-4 w-4 mr-2" />
            Rewards
          </TabsTrigger>
          <TabsTrigger value="redemptions">
            <TicketCheck className="h-4 w-4 mr-2" />
            Redemptions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-6">
          <UserPointsTab />
        </TabsContent>
        <TabsContent value="config" className="mt-6">
          <PointsConfigTab />
        </TabsContent>
        <TabsContent value="rewards" className="mt-6">
          <RewardsTab />
        </TabsContent>
        <TabsContent value="redemptions" className="mt-6">
          <RedemptionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
