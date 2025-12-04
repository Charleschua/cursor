import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";

export async function POST(request) {
  try {
    const body = await request.json();
    const apiKey = body?.key?.trim();

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 });
    }

    // Check if the API key exists in the database
    const { data, error } = await supabase
      .from("api_keys")
      .select("id, name, type")
      .eq("id", apiKey)
      .single();

    if (error || !data) {
      return NextResponse.json({ valid: false }, { status: 200 });
    }

    return NextResponse.json({ valid: true, key: data }, { status: 200 });
  } catch (error) {
    console.error("Error validating API key:", error);
    return NextResponse.json({ valid: false }, { status: 200 });
  }
}

