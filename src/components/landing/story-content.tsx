import { CloudSun, Droplets, PieChart } from "lucide-react";
import type { StoryFeatureItem } from "./story-section";

export const ABOUT_FEATURES: StoryFeatureItem[] = [
  {
    icon: <Droplets className="h-4 w-4" strokeWidth={1.75} />,
    title: "Soil Intelligence",
    description:
      "Moisture, pH, and nutrient composition mapped per field — so every decision starts from the ground up, not a guess.",
    imageSrc: "/images/soil_intelligence_sensor.png",
  },
  {
    icon: <CloudSun className="h-4 w-4" strokeWidth={1.75} />,
    title: "Hyperlocal Weather",
    description:
      "Forecasts tuned to each field's microclimate, timed against irrigation and harvest windows before conditions turn.",
    imageSrc: "/images/hyperlocal_weather_crop.png",
  },
  {
    icon: <PieChart className="h-4 w-4" strokeWidth={1.75} />,
    title: "Resource Allocation",
    description:
      "Water, fertilizer, and equipment tracked against real consumption — cutting waste without cutting yield.",
    imageSrc: "/images/resource_allocation_farming.png",
  },
];
