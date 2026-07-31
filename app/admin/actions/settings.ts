import { createClient } from "@/utils/supabase/server";

export interface SystemSettings {
  id: string;
  voting_open: boolean;
  vote_price_naira: number;
  /** Alias kept for backwards-compat with any call-sites that use `cost_per_vote` */
  cost_per_vote: number;
}

/**
 * Fetches the global system settings row from Supabase.
 * Returns sensible defaults when the row does not exist yet.
 */
export async function getSettings(): Promise<SystemSettings> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("system_settings")
    .select("id, voting_open, vote_price_naira")
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("getSettings(): Failed to fetch system_settings:", error);
  }

  const price = data?.vote_price_naira ?? 100;

  return {
    id: data?.id ?? "",
    voting_open: data?.voting_open ?? true,
    vote_price_naira: price,
    cost_per_vote: price, // convenience alias
  };
}
