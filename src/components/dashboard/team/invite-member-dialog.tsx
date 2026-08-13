"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { ROLES_LIST, ROLE_LABEL, type Role } from "@/lib/roles";
import type { FieldSummary } from "@/types";
import type { Invitation } from "./team-data";
import { useAddInvitation } from "./team-store";

type Step = "form" | "sending" | "success";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InviteMemberDialog({
  open,
  onOpenChange,
  farmName,
  fields,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  farmName: string;
  fields: FieldSummary[];
}) {
  const addInvitation = useAddInvitation();

  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [role, setRole] = useState<Role>("agronomist");
  const [selectedFieldNames, setSelectedFieldNames] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState(`You've been invited to ${farmName}`);
  const [lastInvitation, setLastInvitation] = useState<Invitation | null>(null);

  // Role determines whether field access even applies — Owner/Manager get
  // full-farm access by definition, so the field checklist only matters
  // (and only shows) for Agronomist/Field Worker invites.
  const needsFieldAccess = role === "agronomist" || role === "worker";

  useEffect(() => {
    if (open) {
      setStep("form");
      setEmail("");
      setEmailError(null);
      setRole("agronomist");
      setSelectedFieldNames(new Set());
      setMessage(`You've been invited to ${farmName}`);
    }
  }, [open, farmName]);

  const toggleField = (name: string) => {
    setSelectedFieldNames((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleSend = () => {
    if (!EMAIL_PATTERN.test(email.trim())) {
      setEmailError("Enter a valid email address.");
      return;
    }
    setEmailError(null);
    setStep("sending");

    const timer = setTimeout(() => {
      const invitation: Invitation = {
        id: `invite-${Date.now()}`,
        email: email.trim(),
        role,
        fieldAccess: needsFieldAccess ? Array.from(selectedFieldNames) : "all",
        message: message.trim() || undefined,
        invitedAt: new Date().toISOString(),
      };
      addInvitation(invitation);
      setLastInvitation(invitation);
      setStep("success");
    }, 1100);

    return () => clearTimeout(timer);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => step !== "sending" && onOpenChange(next)}>
      <DialogContent className="sm:max-w-md">
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle>Invite team member</DialogTitle>
              <DialogDescription>They&apos;ll get an email to join {farmName}.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  placeholder="minh@example.com"
                />
                {emailError && <p className="text-xs text-destructive">{emailError}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES_LIST.filter((r) => r !== "owner").map((r) => (
                      <SelectItem key={r} value={r}>
                        {ROLE_LABEL[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {needsFieldAccess && (
                <div className="space-y-1.5">
                  <Label>Field access</Label>
                  <div className="max-h-32 space-y-2 overflow-y-auto rounded-lg border border-border p-3">
                    {fields.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No fields available.</p>
                    ) : (
                      fields.map((field) => (
                        <label key={field.id} className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={selectedFieldNames.has(field.name)}
                            onCheckedChange={() => toggleField(field.name)}
                          />
                          {field.name}
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="invite-message">Message (optional)</Label>
                <Textarea
                  id="invite-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSend}>Send invitation</Button>
            </div>
          </>
        )}

        {step === "sending" && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Sending invitation...</p>
          </div>
        )}

        {step === "success" && lastInvitation && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <p className="font-medium">Invitation sent ✓</p>
            <div>
              <p className="text-sm">{lastInvitation.email}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {ROLE_LABEL[lastInvitation.role]}
                {lastInvitation.fieldAccess !== "all" &&
                  ` · ${lastInvitation.fieldAccess.length} field${lastInvitation.fieldAccess.length === 1 ? "" : "s"} assigned`}
              </p>
            </div>
            <Button className="mt-2 w-full" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
