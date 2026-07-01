import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Contractly — AI Contract Wallet",
    short_name: "Contractly",
    description: "Store, analyze, sign, and track every freelance contract in one place.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0D0D14",
    theme_color: "#534AB7",
    orientation: "portrait",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon", sizes: "192x192", type: "image/png", purpose: "maskable" },
    ],
    categories: ["business", "productivity", "finance"],
  };
}
