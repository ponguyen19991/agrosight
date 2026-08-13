"use client";

import { useState } from "react";
import { AiPreferencesSection } from "./ai-preferences-section";
import { AppearanceSection } from "./appearance-section";
import { DangerZoneSection } from "./danger-zone-section";
import { FarmSection } from "./farm-section";
import { MapDisplaySection } from "./map-display-section";
import { NotificationsSection } from "./notifications-section";
import { ProfileSection } from "./profile-section";
import { SettingsNav, type SettingsSectionId } from "./settings-nav";

export function SettingsView() {
  const [active, setActive] = useState<SettingsSectionId>("profile");

  return (
    <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-5xl min-w-0 flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account, farm, and platform preferences.
        </p>
      </div>

      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start">
        <SettingsNav active={active} onSelect={setActive} />

        <div className="min-w-0 flex-1">
          {active === "profile" && <ProfileSection />}
          {active === "farm" && <FarmSection />}
          {active === "notifications" && <NotificationsSection />}
          {active === "map" && <MapDisplaySection />}
          {active === "ai" && <AiPreferencesSection />}
          {active === "appearance" && <AppearanceSection />}
          {active === "danger" && <DangerZoneSection />}
        </div>
      </div>
    </div>
  );
}
