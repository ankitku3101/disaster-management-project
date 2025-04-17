// app/api/user/profile/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb"; // Your DB connection utility
import User from "@/models/user"; // Your User model

// Handle GET to fetch user profile data
export async function GET(req: Request) {
  const { userId } = await auth(); // Get the Clerk User ID from the session

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect(); // Ensure DB connection

  // Fetch user data based on Clerk's userId
  const user = await User.findOne({ clerkUserId: userId });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Respond with the user data
  return NextResponse.json({ user });
}

// Handle POST to update user profile data
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
