
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Report from '@/models/report'; 

export const dynamic = 'force-dynamic'; 

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function GET() {
  try {
    await connectDB();

    const reports = await Report.find().sort({ timestamp: -1 }); 
    return NextResponse.json({ success: true, data: reports }, { status: 200 });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ success: false, message: 'Error fetching reports' }, { status: 500 });
  }
}
