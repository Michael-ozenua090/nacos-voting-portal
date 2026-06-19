import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Footer from "@/components/layout/Footer";
import TransactionTable from "@/components/admin/TransactionTable";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Transaction Ledger | NACOS Admin",
  description: "Full history of all transactions.",
};

export default async function TransactionsLedgerPage() {
  const supabase = await createClient();

  // --- Auth Guard: Email Whitelist ---
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const isSuperAdmin = user?.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;

  if (!isSuperAdmin) {
    redirect("/admin/dashboard");
  }

  return (
    <>
      <main className="w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl text-gray-900">
            Transaction Ledger
          </h1>
          <p className="text-gray-400 font-body text-sm mt-0.5">
            Full history of all transactions.
          </p>
        </div>
        
        <TransactionTable />
      </main>
      <Footer />
    </>
  );
}
