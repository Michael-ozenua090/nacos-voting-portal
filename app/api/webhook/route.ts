import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    console.log("\n==================================");
    console.log("🟢 1. WEBHOOK PING RECEIVED");
    
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
    const signature = req.headers.get("verif-hash");

    if (!signature || signature !== secretHash) {
      console.log("🔴 UNAUTHORIZED: Hash mismatch");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("🟡 2. FLUTTERWAVE PAYLOAD RECEIVED");

    // Flexible extraction to handle both root-level camelCase and nested snake_case structures
    const txRef = body.txRef || body.data?.tx_ref || body.tx_ref;
    const status = body.status || body.data?.status;
    const flwId = body.id?.toString() || body.data?.id?.toString() || body.flwRef;

    console.log(`ℹ️ Parsed values -> TX Ref: ${txRef}, Status: ${status}, FLW ID: ${flwId}`);

    if (status !== "successful") {
       console.log(`🟠 3. EVENT IGNORED: Status was '${status}' (Expected 'successful')`);
       return NextResponse.json({ message: "Event ignored" }, { status: 200 });
    }

    if (!txRef) {
      console.log("🔴 4. ERROR: Missing transaction reference (txRef) in payload");
      return NextResponse.json({ error: "Missing txRef" }, { status: 400 });
    }

    console.log(`🔵 5. PROCESSING TRANSACTION: ${txRef}`);
    const supabase = await createClient();

    // Fetch the target pending record from your database
    const { data: existingTx, error: txError } = await supabase
      .from("transactions")
      .select("status, nomination_id, number_of_votes")
      .eq("tx_ref", txRef)
      .single();

    if (txError) {
      console.error("🔴 DB ERROR (Fetch TX):", txError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (!existingTx) {
      console.log(`🔴 6. ERROR: TX Reference '${txRef}' not found in database`);
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    if (existingTx.status === "successful") {
      console.log("iana 7. TRANSACTION ALREADY PROCESSED SUCCESSFULLY");
      return NextResponse.json({ message: "Transaction already processed" }, { status: 200 });
    }

    console.log("固定 8. UPDATING TRANSACTION STATUS TO SUCCESSFUL...");
    const { error: updateError } = await supabase
      .from("transactions")
      .update({ status: "successful", flw_ref: flwId })
      .eq("tx_ref", txRef);

    if (updateError) {
      console.error("🔴 DB ERROR (Update TX):", updateError);
      return NextResponse.json({ error: "Database error during transaction update" }, { status: 500 });
    }

    console.log("🟣 9. INCREMENTING NOMINEE VOTES...");
    const { nomination_id, number_of_votes } = existingTx;

    if (nomination_id && number_of_votes) {
      const { data: nominationData, error: nomFetchError } = await supabase
        .from("nominations")
        .select("current_votes")
        .eq("id", nomination_id)
        .single();

      if (nomFetchError) {
         console.error("🔴 DB ERROR (Fetch Nom):", nomFetchError);
         return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      const currentVotes = nominationData?.current_votes || 0;
      const newVotes = currentVotes + Number(number_of_votes);
      console.log(`➡️ Vote Update Details: Adding ${number_of_votes} votes. Old Balance: ${currentVotes}, New Balance: ${newVotes}`);

      const { error: nomUpdateError } = await supabase
        .from("nominations")
        .update({ current_votes: newVotes })
        .eq("id", nomination_id);

      if (nomUpdateError) {
         console.error("🔴 DB ERROR (Update Nom):", nomUpdateError);
         return NextResponse.json({ error: "Database error during vote increment" }, { status: 500 });
      }
    }

    console.log("✅ 10. WEBHOOK RUN COMPLETED AND VOTE COUNTS APPLIED");
    console.log("==================================\n");
    
    // Globally revalidate cache to force all pages to show the latest DB state
    revalidatePath("/", "layout");
    
    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });

  } catch (error) {
    console.error("🔴 FATAL BACKGROUND WEBHOOK ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}