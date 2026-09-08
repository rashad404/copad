import type { Metadata } from "next";
import { laboratoryCopy } from "@/api/labServer";
import LabOrders from "@/components/labs/LabOrders";
export async function generateMetadata(): Promise<Metadata> {
  const { c } = await laboratoryCopy();
  return {
    title: { absolute: `${c.myOrders} | azdoc` },
    robots: { index: false, follow: false },
  };
}
export default function MyLabOrders() {
  return <LabOrders />;
}
