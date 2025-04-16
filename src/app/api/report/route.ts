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
    const description = formData.get('description') as string;
    const timestamp = formData.get('timestamp') as string;
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

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
      description,
      imageUrl: uploadResponse.secure_url,
      timestamp,
    });

    return NextResponse.json({ success: true, data: newReport }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
