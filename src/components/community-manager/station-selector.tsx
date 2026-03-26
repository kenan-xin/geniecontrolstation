"use client";

import { useState, useEffect } from "react";
import {
  Radio,
  Play,
  Mic,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Loader2,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useCommunityManagerStore } from "@/store/community-manager-store";
import {
  useStations,
  useCreateStation,
  useUpdateStation,
  useDeleteStation,
} from "@/hooks/use-stations";
import type { StationWithSchedules, CreateStationData, NewStationSchedule } from "@/types";

// Days of week for schedule
const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface ScheduleFormData {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  programName: string;
}

const emptySchedule: ScheduleFormData = {
  dayOfWeek: "Monday",
  startTime: "09:00",
  endTime: "10:00",
  programName: "",
};

export function StationSelector() {
  const { data: stations = [], isLoading } = useStations();
  const createStation = useCreateStation();
  const updateStation = useUpdateStation();
  const deleteStation = useDeleteStation();

  const {
    activeStationId,
    setActiveStationId,
  } = useCommunityManagerStore();

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<StationWithSchedules | null>(null);
  const [deletingStation, setDeletingStation] = useState<StationWithSchedules | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    segmentDuration: "60",
    logo: "",
  });
  const [schedules, setSchedules] = useState<ScheduleFormData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-select first station with URL on initial load
  useEffect(() => {
    if (stations.length > 0 && activeStationId === null) {
      const firstWithUrl = stations.find((s) => s.url);
      if (firstWithUrl) {
        setActiveStationId(firstWithUrl.id);
      }
    }
  }, [stations, activeStationId, setActiveStationId]);

  const resetForm = () => {
    setFormData({
      name: "",
      url: "",
      segmentDuration: "60",
      logo: "",
    });
    setSchedules([]);
  };

  const handleAddStation = () => {
    resetForm();
    setAddDialogOpen(true);
  };

  const handleEditStation = (station: StationWithSchedules) => {
    setEditingStation(station);
    setFormData({
      name: station.name,
      url: station.url ?? "",
      segmentDuration: station.segmentDuration?.toString() ?? "60",
      logo: station.logo ?? "",
    });
    setSchedules(
      station.schedules?.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        programName: s.programName,
      })) ?? []
    );
    setEditDialogOpen(true);
  };

  const handleDeleteStation = (station: StationWithSchedules) => {
    setDeletingStation(station);
    setDeleteDialogOpen(true);
  };

  const handleAddSchedule = () => {
    setSchedules([...schedules, { ...emptySchedule }]);
  };

  const handleRemoveSchedule = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const handleScheduleChange = (
    index: number,
    field: keyof ScheduleFormData,
    value: string
  ) => {
    setSchedules(
      schedules.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const buildStationData = (): CreateStationData => ({
    name: formData.name,
    url: formData.url || null,
    segmentDuration: parseInt(formData.segmentDuration, 10) || 60,
    logo: formData.logo || null,
    active: true,
    schedules: schedules
      .filter((s) => s.programName.trim())
      .map((s): NewStationSchedule => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        programName: s.programName,
        stationId: 0, // Will be set by API
      })),
  });

  const handleSubmitAdd = async () => {
    if (!formData.name.trim()) {
      toast.error("Station name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const newStation = await createStation.mutateAsync(buildStationData());
      toast.success("Station created successfully");
      setAddDialogOpen(false);
      resetForm();
      setActiveStationId(newStation.id);
    } catch (error) {
      toast.error("Failed to create station");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!editingStation || !formData.name.trim()) {
      toast.error("Station name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateStation.mutateAsync({
        id: editingStation.id,
        data: buildStationData(),
      });
      toast.success("Station updated successfully");
      setEditDialogOpen(false);
      setEditingStation(null);
      resetForm();
    } catch (error) {
      toast.error("Failed to update station");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingStation) return;

    setIsSubmitting(true);
    try {
      await deleteStation.mutateAsync(deletingStation.id);
      toast.success("Station deleted successfully");
      setDeleteDialogOpen(false);
      setDeletingStation(null);
      // If we deleted the active station, clear selection
      if (activeStationId === deletingStation.id) {
        setActiveStationId(null);
      }
    } catch (error) {
      toast.error("Failed to delete station");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      {/* Scrollable wrapper with padding for ring overflow */}
      <div className="overflow-x-auto py-2 -mx-4 px-4">
        <div className="flex gap-3">
          {stations.map((station) => (
          <Card
            key={station.id}
            className={`group relative cursor-pointer shrink-0 w-[120px] transition-all duration-200 hover:shadow-md ${
              activeStationId === station.id
                ? "ring-2 ring-primary shadow-md"
                : "hover:ring-2 hover:ring-primary/30"
            }`}
            onClick={() => setActiveStationId(station.id)}
          >
            <CardContent className="flex flex-col items-center gap-2 py-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-blue-500/10 group-hover:bg-blue-500/15 transition-colors duration-200">
                {station.logo ? (
                  <img
                    src={station.logo}
                    alt={station.name}
                    className="size-10 rounded-full object-cover"
                  />
                ) : (
                  <Radio className="size-5.5 text-blue-500" />
                )}
              </div>
              <div className="text-center min-w-0 w-full">
                <p className="text-sm font-semibold text-foreground truncate">
                  {station.name}
                </p>
              </div>
            </CardContent>

            {/* Kebab menu */}
            <div
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex size-6 items-center justify-center rounded-md hover:bg-accent"
                >
                  <MoreVertical className="size-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditStation(station)}>
                    <Pencil className="size-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => handleDeleteStation(station)}
                  >
                    <Trash2 className="size-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}

        {/* Add Station Card */}
        <Card
          className="cursor-pointer shrink-0 w-[120px] border-dashed transition-all duration-200 hover:shadow-md hover:border-solid hover:border-primary/30"
          onClick={handleAddStation}
        >
          <CardContent className="flex flex-col items-center justify-center gap-2 py-4 h-full">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Plus className="size-5.5 text-muted-foreground/60" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Add Station
            </p>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Add Station Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Station</DialogTitle>
            <DialogDescription>
              Add a new radio station for streaming and recording.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Station Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Kiss 92 FM"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="url">Stream URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="segmentDuration">Segment Duration (seconds)</Label>
              <Input
                id="segmentDuration"
                type="number"
                value={formData.segmentDuration}
                onChange={(e) =>
                  setFormData({ ...formData, segmentDuration: e.target.value })
                }
                min={10}
                max={600}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={formData.logo}
                onChange={(e) =>
                  setFormData({ ...formData, logo: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            {/* Schedule Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Program Schedules</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddSchedule}
                  type="button"
                >
                  <Plus className="size-4 mr-1" />
                  Add Schedule
                </Button>
              </div>

              {schedules.length > 0 && (
                <div className="space-y-2 border rounded-lg p-3">
                  {schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_2fr_auto] gap-2 items-center"
                    >
                      <Select
                        value={schedule.dayOfWeek}
                        onValueChange={(v) =>
                          handleScheduleChange(index, "dayOfWeek", v ?? "")
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS_OF_WEEK.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day.slice(0, 3)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) =>
                          handleScheduleChange(index, "startTime", e.target.value)
                        }
                        className="w-full"
                      />

                      <Input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) =>
                          handleScheduleChange(index, "endTime", e.target.value)
                        }
                        className="w-full"
                      />

                      <Input
                        value={schedule.programName}
                        onChange={(e) =>
                          handleScheduleChange(index, "programName", e.target.value)
                        }
                        placeholder="Program name"
                        className="w-full"
                      />

                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleRemoveSchedule(index)}
                        type="button"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitAdd} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin mr-2" />}
              Create Station
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Station Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Station</DialogTitle>
            <DialogDescription>
              Update station settings and schedules.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Station Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-url">Stream URL</Label>
              <Input
                id="edit-url"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-segmentDuration">
                Segment Duration (seconds)
              </Label>
              <Input
                id="edit-segmentDuration"
                type="number"
                value={formData.segmentDuration}
                onChange={(e) =>
                  setFormData({ ...formData, segmentDuration: e.target.value })
                }
                min={10}
                max={600}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-logo">Logo URL</Label>
              <Input
                id="edit-logo"
                value={formData.logo}
                onChange={(e) =>
                  setFormData({ ...formData, logo: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            {/* Schedule Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Program Schedules</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddSchedule}
                  type="button"
                >
                  <Plus className="size-4 mr-1" />
                  Add Schedule
                </Button>
              </div>

              {schedules.length > 0 && (
                <div className="space-y-2 border rounded-lg p-3">
                  {schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_2fr_auto] gap-2 items-center"
                    >
                      <Select
                        value={schedule.dayOfWeek}
                        onValueChange={(v) =>
                          handleScheduleChange(index, "dayOfWeek", v ?? "")
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS_OF_WEEK.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day.slice(0, 3)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) =>
                          handleScheduleChange(index, "startTime", e.target.value)
                        }
                        className="w-full"
                      />

                      <Input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) =>
                          handleScheduleChange(index, "endTime", e.target.value)
                        }
                        className="w-full"
                      />

                      <Input
                        value={schedule.programName}
                        onChange={(e) =>
                          handleScheduleChange(index, "programName", e.target.value)
                        }
                        placeholder="Program name"
                        className="w-full"
                      />

                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleRemoveSchedule(index)}
                        type="button"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitEdit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Station</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingStation?.name}&quot;? All
              segments for this station will also be deleted. This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
