import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { uniqueCharitySlug } from "@/lib/slug";
import { ALL_CAUSES } from "@/lib/causes";
import { SAN_JOSE } from "@/lib/geo";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const charityName = typeof body?.charityName === "string" ? body.charityName.trim() : "";
  const cause = typeof body?.cause === "string" ? body.cause : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const street = typeof body?.street === "string" ? body.street.trim() : "";
  const city = typeof body?.city === "string" ? body.city.trim() : "";
  const state = typeof body?.state === "string" ? body.state.trim() : "";
  const zip = typeof body?.zip === "string" ? body.zip.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const website = typeof body?.website === "string" ? body.website.trim() : "";
  const hours = typeof body?.hours === "string" ? body.hours.trim() : "";
  const bio = typeof body?.bio === "string" ? body.bio.trim() : "";
  const foundingYear = Number(body?.foundingYear) || new Date().getFullYear();
  const is501c3 = Boolean(body?.is501c3);

  if (!charityName || !cause || !email || !password || !city || !state) {
    return NextResponse.json(
      { error: "Charity name, cause, email, password, city, and state are required." },
      { status: 400 }
    );
  }
  if (!(ALL_CAUSES as readonly string[]).includes(cause)) {
    return NextResponse.json({ error: "Invalid cause." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 }
    );
  }

  const existingAccount = await prisma.charityAccount.findUnique({ where: { email } });
  if (existingAccount) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 }
    );
  }

  const admin = createAdminClient();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: "charity", charityName },
  });
  if (createError || !created.user) {
    return NextResponse.json(
      { error: createError?.message ?? "Could not create account." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) {
    return NextResponse.json({ error: signInError.message }, { status: 400 });
  }

  const slug = await uniqueCharitySlug(charityName);
  const charity = await prisma.charity.create({
    data: {
      slug,
      name: charityName,
      cause,
      verified: false,
      rating: 0,
      reviewCount: 0,
      foundingYear,
      supportersCount: 0,
      is501c3,
      shortDescription: cause,
      bio: bio || "This charity hasn't added a mission statement yet.",
      street: street || "Address not yet provided",
      city,
      state,
      zip: zip || "",
      lat: SAN_JOSE.lat,
      lng: SAN_JOSE.lng,
      phone: phone || "Not provided",
      email,
      website: website || "",
      hours: hours || "Not provided",
      logoInitial: charityName.trim().charAt(0).toUpperCase() || "?",
    },
  });

  const account = await prisma.charityAccount.create({
    data: { email, supabaseUserId: created.user.id, charityId: charity.id },
  });

  return NextResponse.json({ charity: { slug: charity.slug, name: charity.name }, accountId: account.id });
}
