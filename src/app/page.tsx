import { AppShell } from "@/components/trendmind/app-shell";
import { getCampaignBootstrap } from "@/lib/campaign-repository";

export default async function Home() {
  const bootstrap = await getCampaignBootstrap();
  return <AppShell initialBootstrap={bootstrap} />;
}
