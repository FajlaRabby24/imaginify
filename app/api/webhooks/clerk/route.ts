// app/api/webhooks/clerk/route.ts
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: Request) {
  console.log("🔥 Webhook received"); // <--- Log start

  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get headers
  const headerPayload = await headers();

  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.log("❌ Missing Svix headers");
    return new Response("Error occurred -- missing svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);
  console.log("📦 Payload:", payload);

  // Verify the payload
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("❌ Error verifying webhooks", err);
    return new Response("Error occurred", { status: 400 });
  }
  console.log("✅ Webhook verified:", evt.type);

  const { id } = evt.data;
  const eventType = evt.type;

  // ✅ CREATE USER
  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data as any;

    console.log("✅ Event Data:", evt.data);

    const user = {
      clerkId: id,
      email: email_addresses?.[0]?.email_address || "test@gmail.com",
      userName: username ?? `user_${id.slice(0, 6)}`,
      firstName: first_name ?? "",
      lastName: last_name ?? "",
      photo: image_url ?? "",
    };

    const newUser = await createUser(user);
    console.log("✅ New User Created:", newUser);
    const clerk = await clerkClient();

    return NextResponse.json({ message: "OK", user: newUser });
  }

  // ✅ UPDATE USER
  if (eventType === "user.updated") {
    const { id, image_url, first_name, last_name, username } = evt.data;
    console.log("user created");

    const user = {
      firstName: first_name ?? "",
      lastName: last_name ?? "",
      username: username ?? `user_${id.slice(0, 6)}`,
      photo: image_url ?? "",
    };

    const updatedUser = await updateUser(id, user);
    return NextResponse.json({ message: "OK", user: updatedUser });
  }

  // ✅ DELETE USER
  if (eventType === "user.deleted") {
    const { id } = evt.data;
    const deletedUser = await deleteUser(id!);
    return NextResponse.json({ message: "OK", user: deletedUser });
  }

  // Fallback — log other events
  console.log(`Webhook received with ID ${id} and type ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("", { status: 200 });
}
