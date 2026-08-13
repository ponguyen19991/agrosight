"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Pencil, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useCreateField } from "@/hooks/use-fields";
import { polygonAreaHectares, pointsToPolygon } from "@/lib/fields-geo";
import { cn } from "@/lib/utils";
import { useMembers } from "@/components/dashboard/team/team-store";
import { FieldBoundaryDrawer } from "./field-boundary-drawer";

export type BoundarySeed = { points: [number, number][]; name?: string; cropType?: string };

const CROPS = ["Corn", "Rice", "Wheat", "Soybean", "Coffee", "Sugarcane", "Vegetables"];
const GROWTH_STAGES = ["Germination", "Vegetative", "Flowering", "Fruiting", "Maturity", "Harvested"];
const IRRIGATION_TYPES = ["Drip irrigation", "Sprinkler", "Flood irrigation", "Rain-fed", "None"];

type Step = 1 | 2 | 3;

const STEP_LABELS = ["Draw boundary", "Field information", "Field setup"];

export function AddFieldDialog({
  open,
  onOpenChange,
  farmId,
  center,
  boundarySeed,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  farmId: string;
  center: { lat: number; lng: number };
  boundarySeed: BoundarySeed | null;
}) {
  const [step, setStep] = useState<Step>(1);
  const [isDrawing, setIsDrawing] = useState(true);
  const [points, setPoints] = useState<[number, number][]>([]);

  const [name, setName] = useState("");
  const [cropType, setCropType] = useState(CROPS[0]);
  const [plantingDate, setPlantingDate] = useState<Date>(new Date());
  const [growthStage, setGrowthStage] = useState(GROWTH_STAGES[1]);
  const [notes, setNotes] = useState("");

  const [assignedManagerName, setAssignedManagerName] = useState<string>("none");
  const [irrigationType, setIrrigationType] = useState(IRRIGATION_TYPES[0]);
  const [sensors, setSensors] = useState<string[]>([]);
  const [sensorInput, setSensorInput] = useState("");

  const { data: members } = useMembers();
  const createField = useCreateField(farmId);

  const area = useMemo(() => polygonAreaHectares(points), [points]);

  useEffect(() => {
    if (!open) return;
    if (boundarySeed) {
      setPoints(boundarySeed.points);
      setName(boundarySeed.name ?? "");
      setCropType(boundarySeed.cropType ?? CROPS[0]);
      setStep(2);
    } else {
      setPoints([]);
      setName("");
      setCropType(CROPS[0]);
      setStep(1);
      setIsDrawing(true);
    }
    setPlantingDate(new Date());
    setGrowthStage(GROWTH_STAGES[1]);
    setNotes("");
    setAssignedManagerName("none");
    setIrrigationType(IRRIGATION_TYPES[0]);
    setSensors([]);
    setSensorInput("");
  }, [open, boundarySeed]);

  const handleAddSensor = () => {
    const value = sensorInput.trim();
    if (!value) return;
    setSensors((prev) => [...prev, value]);
    setSensorInput("");
  };

  const handleCreate = () => {
    createField.mutate(
      {
        farmId,
        name: name.trim(),
        cropType,
        growthStage,
        boundary: pointsToPolygon(points),
        areaHectares: area,
        notes: notes.trim() || undefined,
        assignedManagerName: assignedManagerName === "none" ? undefined : assignedManagerName,
        irrigationType,
        plantingDate,
      },
      {
        onSuccess: () => {
          toast({ variant: "success", title: "Field created", description: name });
          onOpenChange(false);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Couldn't create field", description: "Try again." });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Field</DialogTitle>
          <DialogDescription>
            Step {step} of 3 · {STEP_LABELS[step - 1]}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <FieldBoundaryDrawer
              center={center}
              points={points}
              onPointsChange={setPoints}
              isDrawing={isDrawing}
            />
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={isDrawing ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsDrawing((v) => !v)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {isDrawing ? "Drawing..." : "Draw polygon"}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setPoints([])}>
                  Clear
                </Button>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Area</p>
                <p className="text-sm font-semibold tabular-nums">{area.toFixed(2)} ha</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Click on the map to place boundary points ({points.length} placed, 3 needed).
            </p>
            <Button className="w-full" disabled={points.length < 3} onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="field-name">Field name</Label>
              <Input
                id="field-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="North Field A1"
              />
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
                    {format(plantingDate, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={plantingDate}
                    onSelect={(d) => d && setPlantingDate(d)}
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
              <Label htmlFor="field-notes">Notes</Label>
              <Textarea
                id="field-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => (boundarySeed ? onOpenChange(false) : setStep(1))}>
                Back
              </Button>
              <Button disabled={!name.trim()} onClick={() => setStep(3)}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
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
              <Label>Sensors</Label>
              <div className="flex gap-2">
                <Input
                  value={sensorInput}
                  onChange={(e) => setSensorInput(e.target.value)}
                  placeholder="e.g. Soil moisture probe"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSensor();
                    }
                  }}
                />
                <Button type="button" variant="outline" size="icon" onClick={handleAddSensor}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {sensors.length > 0 && (
                <ul className="space-y-1.5 pt-1">
                  {sensors.map((sensor, i) => (
                    <li
                      key={`${sensor}-${i}`}
                      className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-1.5 text-sm"
                    >
                      {sensor}
                      <button
                        type="button"
                        onClick={() => setSensors((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
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

            <div className={cn("flex justify-between gap-2")}>
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button disabled={createField.isPending} onClick={handleCreate}>
                {createField.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create field"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
