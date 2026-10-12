import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ABOI NGO — ONG ABOI",
    short_name: "ABOI NGO",
    description:
      "ABOI NGO (ONG ABOI) — Charity, Education, Health & Peace in Benin.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b6b4f",
    icons: [
      { src: "/icon.png", sizes: "any", type: "image/png" },
      { src: "/logo.png", sizes: "any", type: "image/png" },
    ],
  };
}
