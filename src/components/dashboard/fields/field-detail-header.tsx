"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useDeleteField } from "@/hooks/use-fields";
import { ROUTES } from "@/lib/routes";
import type { FieldSummary } from "@/types";
import { exportFieldsCsv, exportFieldsGeoJson } from "./fields-export";

export function FieldDetailHeader({
  field,
  onEdit,
}: {
  field: FieldSummary;
  onEdit: () => void;
}) {
  const router = useRouter();
  const deleteField = useDeleteField(field.farmId);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = () => {
    deleteField.mutate(field.id, {
      onSuccess: () => {
        toast({ variant: "success", title: "Field deleted", description: field.name });
        router.push(ROUTES.dashboard.fields);
      },
      onError: () => {
        toast({ variant: "destructive", title: "Couldn't delete field" });
      },
    });
  };

  return (
    <div>
      <Link
        href={ROUTES.dashboard.fields}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Fields
      </Link>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">{field.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {field.cropType} · {field.areaHectares.toFixed(1)} ha · {field.growthStage}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-1.5" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => exportFieldsGeoJson([field])}
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportFieldsCsv([field])}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete field
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete {field.name}?</DialogTitle>
            <DialogDescription>This permanently removes the field. This can&apos;t be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteField.isPending}>
              Delete field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
