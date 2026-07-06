import AuthCard from "@/components/AuthCard";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const tabParam = sp.tab;
  const tab = (Array.isArray(tabParam) ? tabParam[0] : tabParam) === "login" ? "login" : "signup";

  return <AuthCard initialTab={tab} />;
}
