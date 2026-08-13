import { Bug, CloudSun, Droplet, Layers, Sprout, type LucideIcon } from "lucide-react";

export type GuideCategory = "crops" | "soil" | "irrigation" | "pest" | "weather";

export interface Guide {
  id: string;
  category: GuideCategory;
  title: string;
  readMinutes: number;
  summary: string;
  content: string[];
}

export const CATEGORIES: {
  value: GuideCategory;
  label: string;
  eyebrow: string;
  icon: LucideIcon;
}[] = [
  { value: "crops", label: "Crops", eyebrow: "Crop Management", icon: Sprout },
  { value: "soil", label: "Soil", eyebrow: "Soil Health", icon: Layers },
  { value: "irrigation", label: "Irrigation", eyebrow: "Irrigation", icon: Droplet },
  { value: "pest", label: "Pest & Disease", eyebrow: "Pest & Disease", icon: Bug },
  { value: "weather", label: "Weather", eyebrow: "Weather", icon: CloudSun },
];

export const GUIDES: Guide[] = [
  {
    id: "corn-growth-guide",
    category: "crops",
    title: "Corn Growth Guide",
    readMinutes: 8,
    summary: "The six growth stages of corn and what to watch for at each one.",
    content: [
      "Corn moves through emergence, vegetative growth, tasseling, silking, grain fill, and maturity — each stage has a different water and nutrient demand, so scheduling by calendar days alone tends to under- or over-water.",
      "The biggest yield-determining window is two weeks before to two weeks after silking. Moisture stress here can cut yield more than stress at any other stage, since it directly affects kernel set.",
      "Nitrogen uptake peaks during rapid vegetative growth (V8–V12). A side-dress application timed to this window is usually more efficient than front-loading all nitrogen at planting.",
    ],
  },
  {
    id: "crop-rotation-basics",
    category: "crops",
    title: "Choosing the Right Crop Rotation",
    readMinutes: 6,
    summary: "Why rotating crop families breaks pest cycles and rebuilds soil nitrogen.",
    content: [
      "Planting the same crop family in the same field year after year lets pests and soil-borne diseases specific to that family build up. Rotating to an unrelated family interrupts their life cycle.",
      "Following a heavy nitrogen feeder (like corn) with a legume (like soybeans) is a classic pairing — legumes fix nitrogen in the soil, reducing the fertilizer needed for the next cycle.",
      "A good rule of thumb: alternate deep-rooted and shallow-rooted crops too. It improves soil structure across different depths instead of compacting the same layer repeatedly.",
    ],
  },
  {
    id: "understanding-soil-ph",
    category: "soil",
    title: "Understanding Soil pH",
    readMinutes: 5,
    summary: "Why pH controls nutrient availability more than the nutrients themselves.",
    content: [
      "Most nutrients become chemically locked up outside the 6.0–7.0 pH range, even if they're present in the soil in plenty. Testing pH before adding fertilizer avoids wasting it on nutrients the plant can't absorb.",
      "Acidic soil (below 6.0) is common in high-rainfall regions, where calcium and magnesium leach out over time. Agricultural lime is the standard corrective — it raises pH gradually over weeks, not overnight.",
      "Alkaline soil (above 7.5) is harder to correct and usually needs sulfur-based amendments applied well ahead of planting, since the reaction is slow.",
    ],
  },
  {
    id: "improving-soil-structure",
    category: "soil",
    title: "Improving Soil Structure",
    readMinutes: 7,
    summary: "How organic matter and reduced tillage rebuild compacted soil over seasons.",
    content: [
      "Compacted soil restricts root growth and drainage even when nutrients and water are otherwise available. Structure — not just chemistry — is often the limiting factor on yield.",
      "Cover crops with deep taproots (like daikon radish) can break up compaction biologically, creating channels that following crops' roots can follow.",
      "Reducing tillage passes preserves the fungal networks and aggregate structure that took years to build. Structure rebuilds slowly, but degrades fast under heavy equipment traffic on wet soil.",
    ],
  },
  {
    id: "smart-irrigation-scheduling",
    category: "irrigation",
    title: "Smart Irrigation Scheduling",
    readMinutes: 6,
    summary: "Scheduling by soil moisture data instead of a fixed calendar cuts water use.",
    content: [
      "Fixed watering schedules ignore rainfall and evapotranspiration, which vary week to week — this is the single biggest source of over-irrigation on most farms.",
      "Soil moisture sensors at root depth give a direct read on whether the plant actually needs water, rather than inferring it from the calendar or how the topsoil looks.",
      "Watering early morning reduces evaporation loss compared to midday, and gives foliage time to dry before evening — which also lowers fungal disease risk.",
    ],
  },
  {
    id: "drip-vs-sprinkler",
    category: "irrigation",
    title: "Drip vs Sprinkler Systems",
    readMinutes: 5,
    summary: "Matching irrigation method to crop type, field shape, and water cost.",
    content: [
      "Drip irrigation delivers water directly to the root zone with minimal evaporation loss — typically 85–95% efficiency versus 65–75% for sprinklers — but costs more upfront per hectare.",
      "Sprinklers suit dense, uniform crops like grain where per-plant precision matters less. Drip pays off fastest on high-value row crops or orchards where each plant's yield matters individually.",
      "Water quality matters for drip systems specifically — sediment and mineral buildup can clog emitters over a season without inline filtration.",
    ],
  },
  {
    id: "early-pest-detection",
    category: "pest",
    title: "Early Pest Detection",
    readMinutes: 7,
    summary: "Catching an infestation in its first week instead of its third.",
    content: [
      "Most pest damage becomes visible from a distance only after the population has already grown for one to two generations. Walking field edges weekly and checking the undersides of leaves catches problems earlier.",
      "Yellow sticky traps near field borders give an early warning for flying pests before they spread inward — border rows are almost always hit first.",
      "Not every insect sighting needs treatment. Comparing pest counts against an economic threshold (the point where damage cost exceeds treatment cost) avoids unnecessary spraying.",
    ],
  },
  {
    id: "common-fungal-diseases",
    category: "pest",
    title: "Common Fungal Diseases",
    readMinutes: 6,
    summary: "Recognizing blight, rust, and mildew before they spread field-wide.",
    content: [
      "Most fungal disease spreads fastest in warm, humid conditions with poor airflow — wider plant spacing and morning watering (not evening) both reduce the window fungi need to establish.",
      "Leaf blight shows as browning lesions with concentric rings; rust appears as orange-red pustules on the underside of leaves; powdery mildew looks like a white dusting on the leaf surface.",
      "Removing and destroying infected plant material — rather than composting it on-site — prevents spores from overwintering and reinfecting the same field next season.",
    ],
  },
  {
    id: "reading-weather-forecasts",
    category: "weather",
    title: "Reading Weather Forecasts for Farming",
    readMinutes: 4,
    summary: "Which forecast numbers actually matter for field decisions.",
    content: [
      "Precipitation probability alone isn't enough — pairing it with expected rainfall amount tells you whether it's worth skipping a scheduled irrigation or not.",
      "Dew point, not just humidity percentage, is the better signal for fungal disease risk — a high dew point means leaves will likely stay wet overnight.",
      "Wind forecasts matter most around spraying — most pesticide and fertilizer labels specify a maximum wind speed for application to avoid drift onto neighboring fields.",
    ],
  },
  {
    id: "preparing-extreme-weather",
    category: "weather",
    title: "Preparing for Extreme Weather",
    readMinutes: 5,
    summary: "Pre-season steps that reduce damage from storms, frost, and drought.",
    content: [
      "Drainage matters most before the storm, not during it — clearing field drains and checking for low spots ahead of the wet season prevents standing water from drowning roots.",
      "For frost-sensitive crops, having a response ready (row covers, wind machines, or irrigation for evaporative cooling) matters more than the forecast being perfectly accurate — a few hours of lead time is usually enough.",
      "Building soil organic matter improves water-holding capacity, which buffers both directions — it holds moisture longer into a drought and drains excess faster after a downpour.",
    ],
  },
  {
    id: "detect-early-crop-stress",
    category: "crops",
    title: "How to Detect Early Crop Stress",
    readMinutes: 5,
    summary: "The visual cues that show up days before a plant looks obviously unhealthy.",
    content: [
      "By the time leaves visibly wilt or yellow, the plant has usually been under stress for several days already. Subtler early signs — leaf curling at midday, a duller leaf sheen, slightly delayed growth — show up first.",
      "Checking the same few reference plants at the same time each day makes small changes easier to spot than scanning the whole field at once, since you're comparing against a known baseline.",
      "Stress isn't always water — nutrient deficiency, root damage, and early pest feeding can all produce similar early symptoms. Ruling out soil moisture first narrows down the cause fastest.",
    ],
  },
  {
    id: "understanding-soil-moisture",
    category: "soil",
    title: "Understanding Soil Moisture",
    readMinutes: 5,
    summary: "What the number from a soil moisture sensor actually means for irrigation timing.",
    content: [
      "Soil moisture is usually reported as a percentage of field capacity — the amount of water the soil can hold against gravity. Above field capacity, water just drains away instead of being available to roots.",
      "The useful range for most crops sits between refill point (when stress begins) and field capacity. Irrigating well before hitting the refill point wastes water; waiting too long stresses the plant before you act.",
      "Sensor depth matters as much as the reading itself — a sensor placed above the root zone will report false lows, and one placed too deep will miss early drying near the surface.",
    ],
  },
  {
    id: "irrigation-rainy-season",
    category: "irrigation",
    title: "Managing Irrigation During Rainy Season",
    readMinutes: 6,
    summary: "Why over-watering, not under-watering, becomes the main risk once rains start.",
    content: [
      "Once seasonal rain becomes reliable, the main irrigation risk flips — the goal shifts from preventing drought stress to preventing waterlogging, which suffocates roots just as effectively.",
      "Pausing scheduled irrigation for 24–48 hours after meaningful rainfall (not just any rain) avoids stacking irrigation on top of soil that's already near field capacity.",
      "Fields with poor drainage are the highest risk during this period — checking and clearing drainage channels before the rainy season starts matters more than any irrigation adjustment during it.",
    ],
  },
];

export const FEATURED_GUIDE_IDS = [
  "detect-early-crop-stress",
  "understanding-soil-moisture",
  "irrigation-rainy-season",
];

export const RECENT_GUIDE_IDS = ["corn-growth-guide", "reading-weather-forecasts"];
export const SAVED_GUIDE_IDS = ["drip-vs-sprinkler", "common-fungal-diseases"];
