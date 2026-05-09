import { NextRequest, NextResponse } from "next/server";

import { runAnalyticsCritic, runRiskDetector } from "@/lib/analytics-engine";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ campaignId: string }> },
) {
  try {
    const { campaignId } = await context.params;
    const body = (await request.json().catch(() => ({}))) as { type?: "critic" | "risk" | "both" };
    const type = body.type ?? "both";

    if (type === "critic") {
      return NextResponse.json({ critic: await runAnalyticsCritic(campaignId), risk: null });
    }
    if (type === "risk") {
      return NextResponse.json({ critic: null, risk: await runRiskDetector(campaignId) });
    }

    const [critic, risk] = await Promise.all([
      runAnalyticsCritic(campaignId),
      runRiskDetector(campaignId),
    ]);
    return NextResponse.json({ critic, risk });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Analytics consultation failed.",
      },
      { status: 500 },
    );
  }
}
