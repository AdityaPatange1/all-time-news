/**
 * Stable keys for idempotent seeding. Labels drive prompts; keys dedupe in MongoDB.
 * Theme: everything is geopolitics — power, interdependence, and contest over order.
 */
export const GEOPOLITICS_SEED_TOPICS = [
  {
    key: "semiconductors_export_controls",
    label: "Semiconductors and export controls",
    angle:
      "Chip supply chains as leverage between allied industrial policy and techno-national security.",
  },
  {
    key: "critical_minerals_battery_chains",
    label: "Critical minerals and battery supply chains",
    angle:
      "How lithium, nickel, cobalt, and refining capacity shape alliances and bargaining power.",
  },
  {
    key: "arctic_passages_security",
    label: "Arctic passages and great-power posture",
    angle:
      "Ice melt, shipping realism, and competing coast guard and naval narratives.",
  },
  {
    key: "food_fertilizer_geopolitics",
    label: "Food security, fertilizers, and export restrictions",
    angle:
      "Grain corridors and inputs as instruments of stability and coercion.",
  },
  {
    key: "low_earth_orbit_dual_use",
    label: "Low Earth orbit congestion and dual-use space tech",
    angle:
      "Satellite constellations, SSA, and the overlap of commercial and military timing.",
  },
  {
    key: "subsea_cables_digital_sovereignty",
    label: "Subsea cables and digital sovereignty",
    angle:
      "Bandwidth chokepoints, repairs, and national resilience versus open routing.",
  },
  {
    key: "green_subsidies_industrial_policy",
    label: "Green industrial subsidies and WTO friction",
    angle:
      "IRA-style incentives, friend-shoring, and contest over clean-tech rules.",
  },
  {
    key: "migration_border_instruments",
    label: "Migration governance and border technologies",
    angle:
      "Externalization of asylum processing and biometric lanes as foreign-policy tools.",
  },
  {
    key: "transboundary_water_diplomacy",
    label: "Transboundary rivers and water stress diplomacy",
    angle:
      "Dam cascades, downstream trust, and climate-compounded scarcity.",
  },
  {
    key: "health_security_multilateralism",
    label: "Health security and multilateral preparedness",
    angle:
      "Surveillance norms, pathogen access, and WHO reform debates after recent shocks.",
  },
  {
    key: "cbdc_cross_border_payments",
    label: "Central bank digital currencies and payment rails",
    angle:
      "Sanctions exposure, messaging systems, and currency coalitions.",
  },
  {
    key: "frontier_ai_compute_controls",
    label: "Frontier AI governance and compute controls",
    angle:
      "Export rules on accelerators, cloud access, and alignment among techno-blocs.",
  },
  {
    key: "maritime_chokepoints_energy",
    label: "Maritime chokepoints and energy flows",
    angle:
      "Strategic straits, insurance premia, and naval signaling around commerce.",
  },
  {
    key: "lng_pipeline_geopolitics",
    label: "LNG markets and pipeline geopolitics",
    angle:
      "Price formation, spare capacity, and alliance elasticity after supply shocks.",
  },
  {
    key: "rare_earths_friend_shoring",
    label: "Rare earths processing and friend-shoring",
    angle:
      "Separation chemistry bottlenecks and alliance-linked diversification.",
  },
  {
    key: "media_information_operations",
    label: "Media ecosystems and information competition",
    angle:
      "Platform incentives, state-affiliated narratives, and election-season volatility.",
  },
  {
    key: "pandemic_treaty_lab_access",
    label: "Pandemic treaty debates and lab transparency",
    angle:
      "Access to pathogens, benefit-sharing, and verification politics.",
  },
  {
    key: "mega_events_soft_power",
    label: "Mega-events, soft power, and selective boycotts",
    angle:
      "Sports as diplomatic theater and reputational risk for hosts and sponsors.",
  },
  {
    key: "smart_cities_surveillance_standards",
    label: "Smart cities, surveillance exports, and standards",
    angle:
      "Urban sensing stacks as diplomatic packages tied to vendor ecosystems.",
  },
  {
    key: "biodiversity_genetic_access",
    label: "Biodiversity finance and genetic resource access",
    angle:
      "Nagoya-style benefit-sharing, biotech competition, and conservation funding coalitions.",
  },
] as const;

export type SeedTopicKey = (typeof GEOPOLITICS_SEED_TOPICS)[number]["key"];
