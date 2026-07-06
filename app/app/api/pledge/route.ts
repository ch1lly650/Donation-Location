import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "You must be signed in to pledge an item." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const itemId = typeof body?.itemId === "string" ? body.itemId : "";
  if (!itemId) {
    return NextResponse.json({ error: "Missing itemId." }, { status: 400 });
  }

  const item = await prisma.wishlistItem.findUnique({ where: { id: itemId } });
  if (!item) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }

  const pledge = await prisma.pledge.upsert({
    where: { userId_itemId: { userId: user.id, itemId } },
    create: { userId: user.id, itemId, charityId: item.charityId },
    update: {},
  });

  return NextResponse.json({ pledged: true, pledgeId: pledge.id });
}
