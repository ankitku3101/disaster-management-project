import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import connectDB from '@/lib/mongodb';
import Report from '@/models/report';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const disasterType = formData.get('disasterType') as string;
    const location = formData.get('location') as string;
    const pincodeRaw = formData.get('pincode');
    const description = formData.get('description') as string;
    const timestamp = formData.get('timestamp') as string;
    const imageFile = formData.get('image') as File;

    if (!pincodeRaw) {
      return NextResponse.json({ error: 'Pincode is required' }, { status: 400 });
    }

    const pincode = Number(pincodeRaw);
    if (isNaN(pincode)) {
      return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 });
    }

    if (!imageFile) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // Convert image to base64 and upload to Cloudinary
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUri = `data:${imageFile.type};base64,${base64}`;

    const uploadResponse = await cloudinary.uploader.upload(dataUri, {
      folder: 'disaster_reports',
    });

    await connectDB();

    const newReport = await Report.create({
      name,
      disasterType,
      location,
      pincode,
      description,
      imageUrl: uploadResponse.secure_url,
      timestamp,
    });

    return NextResponse.json({ success: true, data: newReport }, { status: 201 });
  } catch (err) {
    console.error('Error creating report:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
