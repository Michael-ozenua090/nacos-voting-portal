import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nominationId, voterName, voterEmail, numberOfVotes } = body;

    // Validate request body
    if (!nominationId || !voterName || !voterEmail || !numberOfVotes) {
      return NextResponse.json(
        { error: `Missing required fields. Received body: ${JSON.stringify(body)}` },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch the global vote price and voting status from the system_settings table
    const { data: settings, error: settingsError } = await supabase
      .from("system_settings")
      .select("vote_price_naira, voting_open")
      .single();

    if (settingsError && settingsError.code !== "PGRST116") {
      console.error("Error fetching system settings:", settingsError);
      return NextResponse.json({ error: "Failed to fetch system settings" }, { status: 500 });
    }

    const votePrice = settings?.vote_price_naira ?? 100; // Default to 100 if missing
    const isVotingOpen = settings?.voting_open ?? true;

    // Verify that voting is still open
    if (!isVotingOpen) {
      return NextResponse.json({ error: "Voting is currently closed." }, { status: 400 });
    }

    // Calculate the total amount
    const totalAmount = Number(numberOfVotes) * Number(votePrice);

    if (isNaN(totalAmount) || totalAmount <= 0) {
      return NextResponse.json({ error: "Invalid number of votes." }, { status: 400 });
    }

    // Generate Transaction Reference (tx_ref)
    const txRef = `NACOS-AWARDS-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    // Fetch category ID to return the user to the correct page
    const { data: nomination, error: nomError } = await supabase
      .from("nominations")
      .select("category_id")
      .eq("id", nominationId)
      .single();

    if (nomError || !nomination) {
      return NextResponse.json({ error: "Invalid nomination ID." }, { status: 400 });
    }
    const categoryId = nomination.category_id;

    // Database Entry: insert a row into the transactions table with a status of 'pending'
    const { error: insertError } = await supabase
      .from("transactions")
      .insert({
        tx_ref: txRef,
        amount: totalAmount,
        status: "pending",
        voter_name: voterName,
        voter_email: voterEmail,
        nomination_id: nominationId,
        number_of_votes: numberOfVotes
      });

    if (insertError) {
      console.error("Error inserting pending transaction:", insertError);
      return NextResponse.json({ error: "Failed to initialize transaction in database." }, { status: 500 });
    }

    // Flutterwave Integration
    const flutterwaveUrl = "https://api.flutterwave.com/v3/payments";
    const payload = {
      tx_ref: txRef,
      amount: totalAmount,
      currency: "NGN",
      redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/categories/${categoryId}`,
      customer: {
        email: voterEmail,
        name: voterName
      },
      customizations: {
        title: "NACOS Awards Dinner & Dinner Night",
        description: "Voting Portal Tokens Payment"
      }
    };

    const flutterwaveResponse = await fetch(flutterwaveUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const flutterwaveData = await flutterwaveResponse.json();

    if (!flutterwaveResponse.ok || flutterwaveData.status !== "success") {
      console.error("Flutterwave Error:", flutterwaveData);
      return NextResponse.json({ error: "Flutterwave payment initiation failed." }, { status: 500 });
    }

    // If successful, return the link to the frontend
    return NextResponse.json({ link: flutterwaveData.data.link }, { status: 200 });

  } catch (error) {
    console.error("Error in pay API route:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
