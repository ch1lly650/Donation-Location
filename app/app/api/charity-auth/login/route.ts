import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }
  if (data.user.user_metadata?.role !== "charity") {
    await supabase.auth.signOut();
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const account = await prisma.charityAccount.findUnique({
    where: { supabaseUserId: data.user.id },
    include: { charity: true },
  });
  if (!account) {
    await supabase.auth.signOut();
    return NextResponse.json({ error: "Account profile not found." }, { status: 404 });
  }

  return NextResponse.json({ charity: { slug: account.charity.slug, name: account.charity.name } });
}
