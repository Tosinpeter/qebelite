import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Eye, EyeOff } from "lucide-react";

type Widget = {
  id: string;
  name: string;
  type: string;
  position: number;
  visible: boolean;
};

export default function HomeSettings() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: "1", name: "Welcome Banner", type: "banner", position: 0, visible: true },
    { id: "2", name: "Daily Progress", type: "stats", position: 1, visible: true },
    { id: "3", name: "Upcoming Huddles", type: "calendar", position: 2, visible: true },
    { id: "4", name: "Nutrition Tips", type: "content", position: 3, visible: true },
    { id: "5", name: "Workout of the Day", type: "featured", position: 4, visible: true },
    { id: "6", name: "Leaderboard", type: "social", position: 5, visible: false },
  ]);

  const [draggedItem, setDraggedItem] = useState<Widget | null>(null);

  const handleDragStart = (widget: Widget) => {
    setDraggedItem(widget);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetWidget: Widget) => {
    if (!draggedItem || draggedItem.id === targetWidget.id) return;

    const newWidgets = [...widgets];
    const draggedIndex = newWidgets.findIndex(w => w.id === draggedItem.id);
    const targetIndex = newWidgets.findIndex(w => w.id === targetWidget.id);

    newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(targetIndex, 0, draggedItem);

    const reordered = newWidgets.map((w, i) => ({ ...w, position: i }));
    setWidgets(reordered);
    setDraggedItem(null);
  };

  const toggleVisibility = (id: string) => {
    setWidgets(widgets.map(w => 
      w.id === id ? { ...w, visible: !w.visible } : w
    ));
  };

  const handleSave = () => {
    console.log("Saving widget configuration:", widgets);
  };

  const handleReset = () => {
    console.log("Resetting to default configuration");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Home Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customize the home page layout and widget order
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} data-testid="button-reset">
            Reset
          </Button>
          <Button onClick={handleSave} data-testid="button-save">
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Widget Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Drag widgets to reorder them. Toggle visibility with the eye icon.
            </p>
            <div className="space-y-2">
              {widgets.map((widget) => (
                <div
                  key={widget.id}
                  draggable
                  onDragStart={() => handleDragStart(widget)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(widget)}
                  className={`flex items-center gap-3 p-4 rounded-md border hover-elevate cursor-move ${
                    !widget.visible ? "opacity-50" : ""
                  }`}
                  data-testid={`widget-item-${widget.id}`}
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">{widget.name}</div>
                    <div className="text-xs text-muted-foreground">Position {widget.position + 1}</div>
                  </div>
                  <Badge variant="secondary">{widget.type}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleVisibility(widget.id)}
                    data-testid={`button-toggle-${widget.id}`}
                  >
                    {widget.visible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This is how the home page will appear to users
            </p>
            <div className="space-y-3 bg-muted/30 p-4 rounded-md">
              {widgets
                .filter(w => w.visible)
                .sort((a, b) => a.position - b.position)
                .map((widget) => (
                  <div
                    key={widget.id}
                    className="p-3 bg-card rounded border text-sm"
                    data-testid={`preview-widget-${widget.id}`}
                  >
                    <div className="font-medium">{widget.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {widget.type} widget
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
