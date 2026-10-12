import type { Metadata } from "next";
import DonateClient from "./DonateClient";

export const metadata: Metadata = {
  title: "Donate to ABOI NGO (ONG ABOI) — Bank Transfer, MoMo & Waqf Benin",
  description:
    "Donate to ABOI NGO / ONG ABOI Benin by bank transfer, international wire or Mobile Money (MTN, Moov). 100% direct allocation to water, orphans, education & health.",
  alternates: { canonical: "/donate" },
  openGraph: {
    title: "Donate to ABOI NGO (ONG ABOI) — Benin",
    description:
      "Support clean water, orphans, education and health in Benin — donate by bank or Mobile Money.",
    url: "/donate",
  },
};

export default function DonatePage() {
  return <DonateClient />;
}
