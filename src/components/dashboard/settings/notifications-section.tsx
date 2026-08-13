"use client";

import { useState } from "react";
import { AlertTriangle, CloudLightning, FileText, Mail, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { SettingRow, SettingsCard } from "./settings-shared";

export function NotificationsSection() {
  const [fieldAlerts, setFieldAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <SettingsCard title="Notifications" description="What AgroSight should alert you about.">
      <div className="divide-y divide-border">
        <SettingRow
          icon={AlertTriangle}
          label="Field Alerts"
          description="Receive alerts when field health changes"
          control={<Switch checked={fieldAlerts} onCheckedChange={setFieldAlerts} />}
        />
        <SettingRow
          icon={CloudLightning}
          label="Weather Alerts"
          description="Severe weather notifications"
          control={<Switch checked={weatherAlerts} onCheckedChange={setWeatherAlerts} />}
        />
        <SettingRow
          icon={Sparkles}
          label="AI Recommendations"
          description="New AI insights"
          control={<Switch checked={aiRecommendations} onCheckedChange={setAiRecommendations} />}
        />
        <SettingRow
          icon={FileText}
          label="Weekly Report"
          description="Receive weekly farm summary"
          control={<Switch checked={weeklyReport} onCheckedChange={setWeeklyReport} />}
        />
        <SettingRow
          icon={Mail}
          label="Email notifications"
          description="Deliver the alerts above by email as well"
          control={<Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />}
        />
      </div>
    </SettingsCard>
  );
}
