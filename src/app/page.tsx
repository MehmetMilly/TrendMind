import { AppShell } from "@/components/trendmind/app-shell";
import { getCampaignBootstrap } from "@/lib/campaign-repository";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ campaign?: string }>;
}) {
  const params = await searchParams;
  const bootstrap = await getCampaignBootstrap(params?.campaign);
  return <AppShell initialBootstrap={bootstrap} />;
}
