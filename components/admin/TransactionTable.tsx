import TransactionTableClient from "./TransactionTableClient";
import { createClient } from "@/utils/supabase/server";



export default async function TransactionTable() {
  const supabase = await createClient();

  const { data: transactions } = await supabase
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
    .order("created_at", { ascending: false })
    .limit(20);

  const rows = transactions || [];
  return <TransactionTableClient initialRows={rows} />;
}
