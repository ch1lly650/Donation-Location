import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Creates a Supabase client bound to the current request's cookies. Use in
// Server Components and Route Handlers. Create a fresh one per request --
// never share/cache across requests.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component that can't write cookies --
            // fine as long as proxy.ts is refreshing sessions on requests.
          }
        },
      },
    }
  );
}
