import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentCharityAccount() {
  const supabase = await createClient();
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();
  if (!supabaseUser) return null;
  if (supabaseUser.user_metadata?.role !== "charity") return null;

  return prisma.charityAccount.findUnique({
    where: { supabaseUserId: supabaseUser.id },
    include: { charity: true },
  });
}
