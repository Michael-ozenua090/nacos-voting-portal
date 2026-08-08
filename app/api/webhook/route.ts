import { NextRequest, NextResponse } from "next/server";
// import { createClient } from "@/utils/supabase/server";
// import { revalidatePath } from "next/cache";
// import { getSettings } from "@/app/admin/actions/settings";

// ============================================================
// ⚠️  VOTING HAS PERMANENTLY CLOSED — 2026 NACOS AWARDS  ⚠️
// This webhook has been locked down after the conclusion of
// the voting period. All processing logic below is preserved
// as a comment for reference only.
// ============================================================

export async function POST(_req: NextRequest) {
  return NextResponse.json(
    { error: "Voting for this event is permanently closed." },
    { status: 400 }
  );
}

// ── Original execution logic (preserved for reference) ──────────────────────
//
// export async function POST(req: NextRequest) {
//   try {
//     console.log("\n==================================");
//     console.log("🟢 1. WEBHOOK PING RECEIVED");
//
//     const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
//     const signature = req.headers.get("verif-hash");
//
//     if (!signature || signature !== secretHash) {
//       console.log("🔴 UNAUTHORIZED: Hash mismatch");
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//
//     const body = await req.json();
//     console.log("🟡 2. FLUTTERWAVE PAYLOAD RECEIVED");
//
//     const txRef = body.txRef || body.data?.tx_ref || body.tx_ref;
//     const status = body.status || body.data?.status;
//     const flwId = body.id?.toString() || body.data?.id?.toString() || body.flwRef;
//
//     console.log(`ℹ️ Parsed values -> TX Ref: ${txRef}, Status: ${status}, FLW ID: ${flwId}`);
//
//     if (!["successful", "failed", "cancelled"].includes(status)) {
//        console.log(`🟠 3. EVENT IGNORED: Status was '${status}'`);
//        return NextResponse.json({ message: "Event ignored" }, { status: 200 });
//     }
//
//     if (!txRef) {
//       console.log("🔴 4. ERROR: Missing transaction reference (txRef) in payload");
//       return NextResponse.json({ error: "Missing txRef" }, { status: 400 });
//     }
//
//     console.log(`🔵 5. PROCESSING TRANSACTION: ${txRef}`);
//     const supabase = await createClient();
//
//     const { data: existingTx, error: txError } = await supabase
//       .from("transactions")
//       .select("status, nomination_id, number_of_votes, amount")
//       .eq("tx_ref", txRef)
//       .single();
//
//     if (txError) {
//       console.error("🔴 DB ERROR (Fetch TX):", txError);
//       return NextResponse.json({ error: "Database error" }, { status: 500 });
//     }
//
//     if (!existingTx) {
//       console.log(`🔴 6. ERROR: TX Reference '${txRef}' not found in database`);
//       return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
//     }
//
//     if (existingTx.status === "successful") {
//       console.log("iana 7. TRANSACTION ALREADY PROCESSED SUCCESSFULLY");
//       return NextResponse.json({ message: "Transaction already processed" }, { status: 200 });
//     }
//
//     if (status === "failed" || status === "cancelled") {
//       console.log(`固定 8. UPDATING TRANSACTION STATUS TO ${status.toUpperCase()}...`);
//       const { error: updateError } = await supabase
//         .from("transactions")
//         .update({ status: status, flw_ref: flwId })
//         .eq("tx_ref", txRef);
//
//       if (updateError) {
//         console.error("🔴 DB ERROR (Update TX):", updateError);
//         return NextResponse.json({ error: `Database error during transaction ${status} update` }, { status: 500 });
//       }
//       console.log(`✅ 10. WEBHOOK RUN COMPLETED: TRANSACTION MARKED AS ${status.toUpperCase()}`);
//       console.log("==================================\n");
//       revalidatePath("/", "layout");
//       return NextResponse.json({ message: `Webhook processed (${status})` }, { status: 200 });
//     }
//
//     // VERIFY WITH FLUTTERWAVE DIRECTLY (Security Patch)
//     const verifyUrl = `https://api.flutterwave.com/v3/transactions/${flwId}/verify`;
//     const verifyResponse = await fetch(verifyUrl, {
//       method: "GET",
//       headers: {
//         "Authorization": `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
//         "Content-Type": "application/json"
//       }
//     });
//
//     const verifyData = await verifyResponse.json();
//
//     if (!verifyResponse.ok || verifyData.status !== "success" || verifyData.data.status !== "successful") {
//       console.log(`🔴 VERIFICATION FAILED: Transaction ${flwId} is not successful on Flutterwave's end.`);
//       return NextResponse.json({ error: "Transaction verification failed" }, { status: 400 });
//     }
//
//     // 🔒 STRICT ANTI-FRAUD CHECKS
//     const { number_of_votes: numVotes } = existingTx;
//
//     const settings = await getSettings();
//     const expectedAmount = Number(numVotes) * settings.cost_per_vote;
//
//     const paidAmount = verifyData.data.amount;
//     const currency = verifyData.data.currency;
//     const verifiedTxRef = verifyData.data.tx_ref;
//
//     if (verifiedTxRef !== txRef) {
//        console.log(`🔴 FRAUD ALERT: TX Ref mismatch. Payload claimed ${txRef}, but Flutterwave verified ${verifiedTxRef}`);
//        return NextResponse.json({ error: "Transaction reference mismatch" }, { status: 400 });
//     }
//
//     if (paidAmount < expectedAmount || currency !== "NGN") {
//        console.log(`🔴 FRAUD ALERT: Underpayment or wrong currency.`);
//        await supabase.from("transactions").update({ status: "failed", flw_ref: flwId }).eq("tx_ref", txRef);
//        return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
//     }
//
//     console.log("🟢 VALIDATION PASSED. UPDATING TRANSACTION STATUS TO SUCCESSFUL...");
//     const { error: updateError } = await supabase
//       .from("transactions")
//       .update({ status: "successful", flw_ref: flwId })
//       .eq("tx_ref", txRef);
//
//     if (updateError) {
//       console.error("🔴 DB ERROR (Update TX):", updateError);
//       return NextResponse.json({ error: "Database error during transaction update" }, { status: 500 });
//     }
//
//     console.log("🟣 9. INCREMENTING NOMINEE VOTES...");
//     const { nomination_id, number_of_votes } = existingTx;
//
//     if (nomination_id && number_of_votes) {
//       const { data: nominationData, error: nomFetchError } = await supabase
//         .from("nominations")
//         .select("current_votes")
//         .eq("id", nomination_id)
//         .single();
//
//       if (nomFetchError) {
//          console.error("🔴 DB ERROR (Fetch Nom):", nomFetchError);
//          return NextResponse.json({ error: "Database error" }, { status: 500 });
//       }
//
//       const currentVotes = nominationData?.current_votes || 0;
//       const newVotes = currentVotes + Number(number_of_votes);
//
//       const { error: nomUpdateError } = await supabase
//         .from("nominations")
//         .update({ current_votes: newVotes })
//         .eq("id", nomination_id);
//
//       if (nomUpdateError) {
//          console.error("🔴 DB ERROR (Update Nom):", nomUpdateError);
//          return NextResponse.json({ error: "Database error during vote increment" }, { status: 500 });
//       }
//     }
//
//     console.log("✅ 10. WEBHOOK RUN COMPLETED AND VOTE COUNTS APPLIED");
//     console.log("==================================\n");
//
//     revalidatePath("/", "layout");
//
//     return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });
//
//   } catch (error) {
//     console.error("🔴 FATAL BACKGROUND WEBHOOK ERROR:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }