import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";

// Next.js 16: params is a Promise and must be awaited
export async function DELETE(request, context) {
  const { params } = context ?? {};
  const { id } = (await params) ?? {};

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { error } = await supabase.from("api_keys").delete().eq("id", id);

  if (error) {
    console.error("Error deleting api_key:", error);
    return NextResponse.json(
      { error: "Failed to delete key" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}

// Next.js 16: params is a Promise and must be awaited
export async function PATCH(request, context) {
  const { params } = context ?? {};
  const { id } = (await params) ?? {};

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const updates = {};

  if (typeof body.name === "string" && body.name.trim()) {
    updates.name = body.name.trim();
  }
  if (typeof body.type === "string" && body.type.trim()) {
    updates.type = body.type.trim();
  }

  // If nothing to update, just return the existing row (no-op) instead of 400
  if (Object.keys(updates).length === 0) {
    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error loading api_key during no-op PATCH:", error);
      return NextResponse.json(
        { error: "Failed to load key" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  }

  const { data, error } = await supabase
    .from("api_keys")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating api_key:", error);
    return NextResponse.json(
      { error: "Failed to update key" },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}


