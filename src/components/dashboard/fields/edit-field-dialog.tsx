"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useUpdateField } from "@/hooks/use-fields";
import { useMembers } from "@/components/dashboard/team/team-store";
import type { FieldSummary } from "@/types";

const CROPS = ["Corn", "Rice", "Wheat", "Soybean", "Coffee", "Sugarcane", "Vegetables"];
const GROWTH_STAGES = ["Germination", "Vegetative", "Flowering", "Fruiting", "Maturity", "Harvested"];
const IRRIGATION_TYPES = ["Drip irrigation", "Sprinkler", "Flood irrigation", "Rain-fed", "None"];

export function EditFieldDialog({
  field,
  open,
  onOpenChange,
}: {
  field: FieldSummary;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const updateField = useUpdateField(field.farmId);
  const { data: members } = useMembers();

  const [name, setName] = useState(field.name);
  const [cropType, setCropType] = useState(field.cropType);
  const [growthStage, setGrowthStage] = useState(field.growthStage);
  const [plantingDate, setPlantingDate] = useState<Date | undefined>(
    field.plantingDate ? new Date(field.plantingDate) : undefined
  );
  const [notes, setNotes] = useState(field.notes ?? "");
  const [assignedManagerName, setAssignedManagerName] = useState(field.assignedManagerName ?? "none");
  const [irrigationType, setIrrigationType] = useState(field.irrigationType ?? IRRIGATION_TYPES[0]);

  useEffect(() => {
    if (!open) return;
    setName(field.name);
    setCropType(field.cropType);
    setGrowthStage(field.growthStage);
    setPlantingDate(field.plantingDate ? new Date(field.plantingDate) : undefined);
    setNotes(field.notes ?? "");
    setAssignedManagerName(field.assignedManagerName ?? "none");
    setIrrigationType(field.irrigationType ?? IRRIGATION_TYPES[0]);
  }, [open, field]);

  const handleSave = () => {
    updateField.mutate(
      {
        id: field.id,
        input: {
          name: name.trim(),
          cropType,
          growthStage,
          notes: notes.trim() || null,
          assignedManagerName: assignedManagerName === "none" ? null : assignedManagerName,
          irrigationType,
          plantingDate: plantingDate ?? null,
        },
      },
      {
        onSuccess: () => {
          toast({ variant: "success", title: "Field updated", description: name });
          onOpenChange(false);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Couldn't update field" });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit field</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-field-name">Field name</Label>
            <Input id="edit-field-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Crop</Label>
            <Select value={cropType} onValueChange={setCropType}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CROPS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Planting date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2 font-normal">
                  <CalendarIcon className="h-4 w-4" />
                  {plantingDate ? format(plantingDate, "MMM d, yyyy") : "Not set"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={plantingDate}
                  onSelect={setPlantingDate}
                  captionLayout="dropdown"
                  startMonth={new Date(2023, 0)}
                  endMonth={new Date(2030, 11)}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <Label>Growth stage</Label>
            <Select value={growthStage} onValueChange={setGrowthStage}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GROWTH_STAGES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Assigned manager</Label>
            <Select value={assignedManagerName} onValueChange={setAssignedManagerName}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unassigned</SelectItem>
                {(members ?? []).map((m) => (
                  <SelectItem key={m.id} value={m.name}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Irrigation</Label>
            <Select value={irrigationType} onValueChange={setIrrigationType}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {IRRIGATION_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-field-notes">Notes</Label>
            <Textarea
              id="edit-field-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!name.trim() || updateField.isPending} onClick={handleSave}>
            {updateField.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
