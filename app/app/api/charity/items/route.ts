import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentCharityAccount } from "@/lib/charityAuth";

const CATEGORIES = ["Clothing", "Food", "Hygiene", "School supplies", "Household"];
const CONDITIONS = ["New only", "New or used"];

export async function POST(request: NextRequest) {
  const account = await getCurrentCharityAccount();
  if (!account) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const category = typeof body?.category === "string" ? body.category : "";
  const condition = typeof body?.condition === "string" ? body.condition : "";
  const note = typeof body?.note === "string" ? body.note.trim() : "";
  const icon = typeof body?.icon === "string" && body.icon.trim() ? body.icon.trim() : "📦";
  const highNeed = Boolean(body?.highNeed);

  if (!name || !CATEGORIES.includes(category) || !CONDITIONS.includes(condition)) {
    return NextResponse.json(
      { error: "Name, a valid category, and a valid condition are required." },
      { status: 400 }
    );
  }

  const item = await prisma.wishlistItem.create({
    data: { charityId: account.charityId, name, category, condition, note, icon, highNeed },
  });

  return NextResponse.json({ item });
}
