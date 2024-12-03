import r2 from '@/lib/CloudFlare/Config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';

// Create a new S3 client

export const POST = async (req: NextRequest) => {
  try {
    // Get form data from the request
    const formData = await req.formData();
    const file: File = formData.get('file') as File;
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create the S3 PutObjectCommand
    const putObjectCmd = new PutObjectCommand({
      Bucket: 'codejam',
      Key: file.name,
      Body: buffer,
    });

    // Send the request to Cloudflare R2
    const res = await r2.send(putObjectCmd);

    console.log('File uploaded successfully:', res);
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}; 