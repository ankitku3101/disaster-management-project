import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import twilio from "twilio";

// Helper function to format the phone number
const formatPhoneNumber = (number: string) => {
  // Check if the number starts with the "+" sign, else add the country code (for India, +91)
  if (!number.startsWith("+")) {
    return `+91${number}`; // Assuming all numbers are Indian numbers. Adjust if needed for other countries
  }
  return number;
};

export async function POST(req: Request) {
  const body = await req.json();
  const { message } = body;

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  await dbConnect();

  const users = await User.find({ phoneNumber: { $exists: true, $ne: "" } });

  if (!users || users.length === 0) {
    return NextResponse.json({ error: "No users with phone numbers found" }, { status: 404 });
  }

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  );

  // Function to send SMS to each user
  const sendSMS = async (to: string) => {
    try {
      const formattedPhoneNumber = formatPhoneNumber(to); // Format phone number

      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: formattedPhoneNumber, // Send the formatted phone number
      });
      console.log(`SMS sent to ${formattedPhoneNumber}`);
    } catch (err) {
      console.error(`Failed to send SMS to ${to}:`, err);
    }
  };

  // Send SMS to all users
  await Promise.all(users.map((user) => sendSMS(user.phoneNumber)));

  return NextResponse.json({ success: true, message: "Messages sent to all users" });
}
