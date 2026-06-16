import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Security Verification (Critical)
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
    const signature = req.headers.get("verif-hash");

    if (!signature || signature !== secretHash) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Payload Extraction
    const body = await req.json();

    if (body.event !== "charge.completed" || body.data?.status !== "successful") {
      // Return 200 so Flutterwave stops retrying, but we don't process it.
      return NextResponse.json({ message: "Event ignored" }, { status: 200 });
    }

    const txRef = body.data.tx_ref;
    const flwRef = body.data.id?.toString();

    if (!txRef) {
      return NextResponse.json({ error: "Missing tx_ref in payload" }, { status: 400 });
    }

    const supabase = await createClient();

    // 3. Database Idempotency Check
    const { data: existingTx, error: txError } = await supabase
      .from("transactions")
      .select("status, nomination_id, number_of_votes")
      .eq("tx_ref", txRef)
      .single();

    if (txError) {
      console.error("Error fetching transaction for idempotency check:", txError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (!existingTx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    if (existingTx.status === "successful") {
      // Transaction already processed, return 200 immediately to prevent double counting
      return NextResponse.json({ message: "Transaction already processed" }, { status: 200 });
    }

    // 4. Update Transaction
    const { error: updateError } = await supabase
      .from("transactions")
      .update({ status: "successful", flw_ref: flwRef })
      .eq("tx_ref", txRef);

    if (updateError) {
      console.error("Error updating transaction status:", updateError);
      return NextResponse.json({ error: "Database error during transaction update" }, { status: 500 });
    }

    // 5. Increment Votes
    const { nomination_id, number_of_votes } = existingTx;

    if (nomination_id && number_of_votes) {
      // Fetch the current_votes
      const { data: nominationData, error: nomFetchError } = await supabase
        .from("nominations")
        .select("current_votes")
        .eq("id", nomination_id)
        .single();

      if (nomFetchError) {
        console.error("Error fetching nomination current votes:", nomFetchError);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      const currentVotes = nominationData?.current_votes || 0;
      const newVotes = currentVotes + Number(number_of_votes);

      // Update the nominations table
      const { error: nomUpdateError } = await supabase
        .from("nominations")
        .update({ current_votes: newVotes })
        .eq("id", nomination_id);

      if (nomUpdateError) {
        console.error("Error updating nomination votes:", nomUpdateError);
        return NextResponse.json({ error: "Database error during vote increment" }, { status: 500 });
      }
    }

    // 6. Response
    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
