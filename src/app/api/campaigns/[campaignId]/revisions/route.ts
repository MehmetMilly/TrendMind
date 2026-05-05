import { NextRequest, NextResponse } from "next/server";

import { addRevisionNote } from "@/lib/campaign-repository";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ campaignId: string }> },
) {
  try {
    const { campaignId } = await context.params;
    const body = (await request.json()) as {
      phase: string;
      note: string;
    };

    const campaign = await addRevisionNote(campaignId, {
      phase: body.phase as never,
      note: body.note,
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to store the revision note.",
      },
      { status: 400 },
    );
  }
}
