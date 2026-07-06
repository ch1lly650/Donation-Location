import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentCharityAccount } from "@/lib/charityAuth";

const CATEGORIES = ["Clothing", "Food", "Hygiene", "School supplies", "Household"];
const CONDITIONS = ["New only", "New or used"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const account = await getCurrentCharityAccount();
  if (!account) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const { id } = await params;

  const existing = await prisma.wishlistItem.findUnique({ where: { id } });
  if (!existing || existing.charityId !== account.charityId) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : undefined;
  const category = typeof body?.category === "string" ? body.category : undefined;
  const condition = typeof body?.condition === "string" ? body.condition : undefined;
  const note = typeof body?.note === "string" ? body.note.trim() : undefined;
  const icon = typeof body?.icon === "string" ? body.icon.trim() : undefined;
  const highNeed = typeof body?.highNeed === "boolean" ? body.highNeed : undefined;

  if (category !== undefined && !CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }
  if (condition !== undefined && !CONDITIONS.includes(condition)) {
    return NextResponse.json({ error: "Invalid condition." }, { status: 400 });
  }

  const item = await prisma.wishlistItem.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(category && { category }),
      ...(condition && { condition }),
      ...(note !== undefined && { note }),
      ...(icon !== undefined && { icon }),
      ...(highNeed !== undefined && { highNeed }),
    },
  });

  return NextResponse.json({ item });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const account = await getCurrentCharityAccount();
  if (!account) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const { id } = await params;

  const existing = await prisma.wishlistItem.findUnique({ where: { id } });
  if (!existing || existing.charityId !== account.charityId) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }

  await prisma.wishlistItem.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
