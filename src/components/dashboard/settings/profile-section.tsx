"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { FieldRow, SettingsCard } from "./settings-shared";

export function ProfileSection() {
  const [name, setName] = useState("Adrian Sora");
  const [email, setEmail] = useState("farmer@agrosight.com");

  const handleSave = () => {
    toast({
      variant: "success",
      title: "Saved",
      description: "Your profile has been updated.",
    });
  };

  return (
    <SettingsCard title="Profile" description="Your personal account details.">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-16 w-16 border border-border">
            <AvatarImage src="/images/famer-user.png" alt="Account avatar" />
            <AvatarFallback className="bg-secondary text-lg">AS</AvatarFallback>
          </Avatar>
          <button
            type="button"
            aria-label="Change avatar"
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground"
          >
            <Camera className="h-3 w-3" />
          </button>
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">Farm Manager</p>
        </div>
      </div>

      <div className="mt-5 divide-y divide-border border-t border-border">
        <FieldRow label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9" />
        </FieldRow>
        <FieldRow label="Email">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-9"
          />
        </FieldRow>
        <FieldRow label="Role">
          <p className="text-sm">Farm Manager</p>
        </FieldRow>
      </div>

      <div className="mt-5 flex justify-end">
        <Button onClick={handleSave}>Save changes</Button>
      </div>
    </SettingsCard>
  );
}
