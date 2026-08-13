"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { ROUTES } from "@/lib/routes";

function DangerRow({
  title,
  description,
  actionLabel,
  dialogTitle,
  dialogDescription,
  confirmLabel,
  onConfirm,
}: {
  title: string;
  description: string;
  actionLabel: string;
  dialogTitle: string;
  dialogDescription: string;
  confirmLabel: string;
  onConfirm: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    // Demo only — no backend wired up, this just fakes the action.
    setTimeout(() => {
      setIsSubmitting(false);
      setOpen(false);
      onConfirm();
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm" className="shrink-0">
            {actionLabel}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                confirmLabel
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function DangerZoneSection() {
  const router = useRouter();

  return (
    <Card className="border-destructive/30 bg-destructive/[0.03]">
      <CardContent className="pt-5">
        <p className="font-medium text-destructive">Danger Zone</p>
        <div className="mt-4 divide-y divide-destructive/15">
          <DangerRow
            title="Reset demo data"
            description="Remove all seeded farm data."
            actionLabel="Reset data"
            dialogTitle="Reset demo data?"
            dialogDescription="This clears all fields, resource logs, and yield history for this demo farm. This can't be undone."
            confirmLabel="Reset data"
            onConfirm={() =>
              toast({
                variant: "success",
                title: "Data reset",
                description: "Demo data has been cleared.",
              })
            }
          />
          <DangerRow
            title="Delete account"
            description="Permanently delete your account."
            actionLabel="Delete account"
            dialogTitle="Delete your account?"
            dialogDescription="This permanently deletes your account and all associated farm data. This can't be undone."
            confirmLabel="Delete account"
            onConfirm={() => {
              toast({
                variant: "success",
                title: "Account deleted",
                description: "See you again soon.",
              });
              router.push(ROUTES.login);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
