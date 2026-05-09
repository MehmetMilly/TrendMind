import { NextRequest, NextResponse } from "next/server";

import { computeAnalyticsData } from "@/lib/analytics-utils";
import { getCampaign } from "@/lib/campaign-repository";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ campaignId: string }> },
) {
  try {
    const { campaignId } = await context.params;
    const campaign = await getCampaign(campaignId);
    return NextResponse.json(computeAnalyticsData(campaign));
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to load analytics.",
      },
      { status: 404 },
    );
  }
}
