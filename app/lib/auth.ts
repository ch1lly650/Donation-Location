import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();
  if (!supabaseUser) return null;
  if (supabaseUser.user_metadata?.role !== "donor") return null;

  return prisma.user.findUnique({ where: { supabaseUserId: supabaseUser.id } });
}
