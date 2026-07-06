import CharityAuthCard from "@/components/CharityAuthCard";

export default async function ForNonprofitsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const tabParam = sp.tab;
  const tab = (Array.isArray(tabParam) ? tabParam[0] : tabParam) === "login" ? "login" : "signup";

  return <CharityAuthCard initialTab={tab} />;
}
