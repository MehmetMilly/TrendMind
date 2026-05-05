import { NextRequest, NextResponse } from "next/server";

import {
  getCampaign,
  updateCampaignBrief,
} from "@/lib/campaign-repository";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ campaignId: string }> },
) {
  try {
    const { campaignId } = await context.params;
    const campaign = await getCampaign(campaignId);
    return NextResponse.json(campaign);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load the campaign.",
      },
      { status: 404 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ campaignId: string }> },
) {
  try {
    const { campaignId } = await context.params;
    const patch = await request.json();
    const campaign = await updateCampaignBrief(campaignId, patch);
    return NextResponse.json(campaign);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update the campaign brief.",
      },
      { status: 400 },
    );
  }
}
