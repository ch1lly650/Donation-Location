import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentCharityAccount } from "@/lib/charityAuth";
import { ALL_CAUSES } from "@/lib/causes";
import { geocodeAddressParts } from "@/lib/geocode";

export async function PATCH(request: NextRequest) {
  const account = await getCurrentCharityAccount();
  if (!account) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const str = (key: string) => (typeof body[key] === "string" ? body[key].trim() : undefined);

  const name = str("name");
  const cause = str("cause");
  const bio = str("bio");
  const street = str("street");
  const city = str("city");
  const state = str("state");
  const zip = str("zip");
  const phone = str("phone");
  const email = str("email");
  const website = str("website");
  const hours = str("hours");
  const foundingYear = body.foundingYear !== undefined ? Number(body.foundingYear) : undefined;
  const is501c3 = typeof body.is501c3 === "boolean" ? body.is501c3 : undefined;

  if (cause !== undefined && !(ALL_CAUSES as readonly string[]).includes(cause)) {
    return NextResponse.json({ error: "Invalid cause." }, { status: 400 });
  }

  let coords: { lat: number; lng: number } | undefined;
  if (street !== undefined || city !== undefined || state !== undefined || zip !== undefined) {
    const current = await prisma.charity.findUnique({
      where: { id: account.charityId },
      select: { street: true, city: true, state: true, zip: true },
    });
    const geocoded = await geocodeAddressParts({
      street: street ?? current?.street,
      city: city ?? current?.city ?? "",
      state: state ?? current?.state ?? "",
      zip: zip ?? current?.zip,
    });
    if (geocoded) coords = { lat: geocoded.lat, lng: geocoded.lng };
  }

  const charity = await prisma.charity.update({
    where: { id: account.charityId },
    data: {
      ...(name && { name, logoInitial: name.charAt(0).toUpperCase() }),
      ...(cause && { cause, shortDescription: cause }),
      ...(bio !== undefined && { bio }),
      ...(street !== undefined && { street }),
      ...(city && { city }),
      ...(state && { state }),
      ...(zip !== undefined && { zip }),
      ...(phone !== undefined && { phone }),
      ...(email !== undefined && { email }),
      ...(website !== undefined && { website }),
      ...(hours !== undefined && { hours }),
      ...(foundingYear !== undefined && !Number.isNaN(foundingYear) && { foundingYear }),
      ...(is501c3 !== undefined && { is501c3 }),
      ...(coords ?? {}),
    },
  });

  return NextResponse.json({ charity });
}
