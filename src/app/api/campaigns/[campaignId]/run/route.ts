import { NextRequest, NextResponse } from "next/server";

import { startCampaignRun } from "@/lib/campaign-engine";
import { getCampaign } from "@/lib/campaign-repository";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ campaignId: string }> },
) {
  try {
    const { campaignId } = await context.params;
    const body = (await request.json()) as {
      startPhase?: string;
      note?: string;
      mode?: "full" | "phase";
    };

    const runId = await startCampaignRun(campaignId, {
      startPhase: (body.startPhase as never) ?? "research",
      note: body.note,
      mode: body.mode ?? "full",
    });

    const campaign = await getCampaign(campaignId);
    return NextResponse.json({ runId, campaign });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to start the campaign run.",
      },
      { status: 400 },
    );
  }
}
