import { NextRequest, NextResponse } from "next/server";

import { startDummyRun } from "@/lib/campaign-repository";

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

    const payload = await startDummyRun(campaignId, {
      startPhase: (body.startPhase as never) ?? "research",
      note: body.note,
      mode: body.mode ?? "full",
    });

    return NextResponse.json(payload);
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
