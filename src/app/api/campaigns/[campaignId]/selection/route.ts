import { NextRequest, NextResponse } from "next/server";

import { updateSelection } from "@/lib/campaign-repository";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ campaignId: string }> },
) {
  try {
    const { campaignId } = await context.params;
    const body = await request.json();
    const campaign = await updateSelection(campaignId, body);
    return NextResponse.json(campaign);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update the selection.",
      },
      { status: 400 },
    );
  }
}
