import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase
    .from("api_keys")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching api_keys:", error);
    return NextResponse.json({ error: "Failed to load keys" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request) {
  const body = await request.json();
  const name = body?.name?.trim();
  const type = body?.type || "dev";

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const id = `dandi_${type}_${Math.random()
    .toString(36)
    .slice(2, 10)
    .toUpperCase()}`;

  const { data, error } = await supabase
    .from("api_keys")
    .insert({
      id,
      name,
      type,
      usage: 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating api_key:", error);
    return NextResponse.json(
      { error: "Failed to create key" },
      { status: 500 },
    );
  }

  return NextResponse.json(data, { status: 201 });
}


