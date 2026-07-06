import { redirect } from "next/navigation";
import { getCurrentCharityAccount } from "@/lib/charityAuth";
import { prisma } from "@/lib/db";
import CharityDashboard from "@/components/CharityDashboard";

export default async function CharityDashboardPage() {
  const account = await getCurrentCharityAccount();
  if (!account) redirect("/for-nonprofits?tab=login");

  const charity = await prisma.charity.findUnique({
    where: { id: account.charityId },
    include: { items: { orderBy: { name: "asc" } } },
  });
  if (!charity) redirect("/for-nonprofits?tab=login");

  return <CharityDashboard charity={charity} />;
}
