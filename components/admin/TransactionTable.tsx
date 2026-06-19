import TransactionTableClient from "./TransactionTableClient";
import { createClient } from "@/utils/supabase/server";



export default async function TransactionTable({ limit }: { limit?: number }) {
  const supabase = await createClient();

  let query = supabase
    .from("transactions")
    .select(`
      id,
      tx_ref,
      voter_name,
      voter_email,
      amount,
      number_of_votes,
      status,
      created_at,
      nominations (
        contestants (
          name
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data: transactions } = await query;

  const rows = transactions || [];
  return <TransactionTableClient initialRows={rows} />;
}
