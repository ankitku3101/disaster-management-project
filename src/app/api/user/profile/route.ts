// app/api/user/profile/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb"; // Your DB connection utility
import User from "@/models/user"; // Your User model

export async function POST(req: Request) {
  const { userId } = await auth(); // Get the Clerk User ID from the session

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { phoneNumber, location } = await req.json();

  // Validate data
  if (!phoneNumber || !location) {
    return NextResponse.json({ error: "Phone number and location are required." }, { status: 400 });
  }

  await dbConnect(); // Ensure DB connection

  // Check if the user already exists
  const existingUser = await User.findOne({ clerkUserId: userId });

  if (existingUser) {
    // If user exists, update their details
    existingUser.phoneNumber = phoneNumber;
    existingUser.location = location;
    await existingUser.save();
    return NextResponse.json({ message: "User profile updated successfully.", user: existingUser });
  }

  // Otherwise, create a new user record
  const newUser = new User({
    clerkUserId: userId,
    phoneNumber,
    location,
  });

  await newUser.save();

  return NextResponse.json({ message: "User profile created successfully.", user: newUser });
}
