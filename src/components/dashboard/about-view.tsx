import {
  ArrowRight,
  Bot,
  Cloud,
  Database,
  Map as MapIcon,
  Satellite,
  Sparkles,
  Sprout,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const FEATURES = [
  {
    icon: Sprout,
    title: "Field Monitoring",
    stat: "12 fields",
  },
  {
    icon: Sparkles,
    title: "AI Insights",
    stat: "8 insights",
  },
  {
    icon: Cloud,
    title: "Weather Monitoring",
    stat: null,
  },
  {
    icon: Satellite,
    title: "Satellite Field Mapping",
    stat: null,
  },
];

const HOW_IT_WORKS = ["Field Data", "Monitoring", "Analysis", "AI", "Action"];

const SYSTEM_INFO = [
  { icon: Database, label: "Data updated", value: "3 min ago" },
  { icon: Cloud, label: "Weather source", value: "OpenWeather" },
  { icon: MapIcon, label: "Map provider", value: "MapTiler" },
  { icon: Bot, label: "AI provider", value: "Claude" },
];

export function AboutView() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-3xl min-w-0 flex-col gap-3 sm:gap-4">
      <Card className="glass-panel border-0">
        <CardContent className="pt-5">
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium">About Farm Intelligence</p>
            <Badge variant="secondary" className="shrink-0">
              v1.0.0
            </Badge>
          </div>

          <h1 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">
            Understand your farm.
            <br />
            Make better decisions.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Farm Intelligence is a precision agriculture platform that brings
            field data, weather, satellite imagery and AI insights into one
            place.
          </p>
        </CardContent>
      </Card>

      <Card className="glass-panel border-0">
        <CardContent className="pt-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-xl bg-muted/60 p-4">
                <feature.icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                <p className="mt-3 text-sm font-medium leading-tight">{feature.title}</p>
                {feature.stat && (
                  <p className="mt-1 text-xs text-muted-foreground">{feature.stat}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel border-0">
        <CardContent className="pt-5">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            How It Works
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-3">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-full bg-muted/60 px-3 py-1.5 text-xs font-medium sm:text-sm">
                  {step}
                </span>
                {i < HOW_IT_WORKS.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel border-0">
        <CardContent className="pt-5">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            System
          </p>
          <div className="mt-1">
            {SYSTEM_INFO.map((item, i) => (
              <div key={item.label}>
                {i > 0 && <Separator />}
                <div className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <item.icon className="h-4 w-4" strokeWidth={1.75} />
                    {item.label}
                  </div>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
