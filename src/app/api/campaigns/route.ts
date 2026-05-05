import { NextRequest, NextResponse } from "next/server";

import {
  createCampaign,
  getCampaignBootstrap,
} from "@/lib/campaign-repository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const campaignId = request.nextUrl.searchParams.get("campaignId");
    const payload = await getCampaignBootstrap(campaignId);
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load campaigns.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      campaignName?: string;
      brandName?: string;
      productName?: string;
      platform?: string;
    };

    const campaign = await createCampaign(body);
    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create campaign.",
      },
      { status: 500 },
    );
  }
}
