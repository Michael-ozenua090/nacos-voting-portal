"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function injectDummyVotes(
  nominationId: string,
  numberOfVotes: number
) {
  try {
    const supabase = await createClient();

    // ── RBAC Guard ────────────────────────────────────────────────────────────
    // Verify the caller is the Superadmin before touching any data.
    // This is a server-side check and cannot be bypassed from the client.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;

    if (!user || !superAdminEmail || user.email !== superAdminEmail) {
      return {
        success: false,
        error: "Unauthorized: Superadmin access required.",
      };
    }
    // ─────────────────────────────────────────────────────────────────────────

    // 1. Fetch current votes from the nomination row
    const { data: nomination, error: fetchError } = await supabase
      .from("nominations")
      .select("current_votes")
      .eq("id", nominationId)
      .single();

    if (fetchError || !nomination) {
      return { success: false, error: "Nomination not found." };
    }

    const newVotes = (nomination.current_votes || 0) + numberOfVotes;
    const dummyTxRef = `DUMMY-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()}`;

    // 2. Insert a dummy transaction record (amount: 0, is_dummy: true)
    const { error: txError } = await supabase.from("transactions").insert({
      tx_ref: dummyTxRef,
      amount: 0,
      status: "successful",
      is_dummy: true,
      voter_name: "Superadmin (System)",
      voter_email: "admin@nacos.org",
      nomination_id: nominationId,
      number_of_votes: numberOfVotes,
    });

    if (txError) throw txError;

    // 3. Update the nomination's aggregated vote count
    const { error: updateError } = await supabase
      .from("nominations")
      .update({ current_votes: newVotes })
      .eq("id", nominationId);

    if (updateError) throw updateError;

    // 4. Revalidate the entire layout so the public leaderboard reflects
    //    the new totals on the next request.
    revalidatePath("/", "layout");

    return {
      success: true,
      message: `Successfully injected ${numberOfVotes} dummy vote${numberOfVotes !== 1 ? "s" : ""}!`,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred.";
    console.error("Error injecting dummy votes:", message);
    return { success: false, error: "Failed to inject votes. Check server logs." };
  }
}
