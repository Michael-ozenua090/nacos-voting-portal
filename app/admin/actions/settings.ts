'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

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

export interface SaveSettingsPayload {
  voting_open: boolean;
  vote_price_naira: number;
  /** Existing row id — if provided the row is updated, otherwise inserted. */
  id?: string | null;
}

/**
 * Persists the global system settings and busts the home page cache
 * so the hero badge price updates immediately for all users.
 */
export async function saveSettings(payload: SaveSettingsPayload): Promise<{ error: string | null }> {
  const supabase = await createClient();

  let dbError;

  if (payload.id) {
    // Update existing row
    const { error } = await supabase
      .from("system_settings")
      .update({
        voting_open: payload.voting_open,
        vote_price_naira: payload.vote_price_naira,
      })
      .eq("id", payload.id);
    dbError = error;
  } else {
    // Insert first-ever row
    const { error } = await supabase
      .from("system_settings")
      .insert([{ voting_open: payload.voting_open, vote_price_naira: payload.vote_price_naira }]);
    dbError = error;
  }

  if (dbError) {
    return { error: dbError.message };
  }

  // Bust Next.js cache so the home page hero badge shows the new price immediately
  revalidatePath("/");

  return { error: null };
}
