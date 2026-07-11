import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const zip = typeof body?.zip === "string" ? body.zip.trim() : "";
  const emailOptIn = Boolean(body?.emailOptIn);

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Full name, email, and password are required." },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
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
    user_metadata: { role: "donor", name },
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

  const user = await prisma.user.create({
    data: { name, email, supabaseUserId: created.user.id, zip: zip || null, emailOptIn },
  });

  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
}
