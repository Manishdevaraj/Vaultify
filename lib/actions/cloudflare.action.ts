import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
const r2 = new S3Client({
  region: 'auto', // Cloudflare R2 uses 'auto' for the region
  credentials: {
    accessKeyId: process.env.NEXT_R2_ACCESS_KEY!,
    secretAccessKey: process.env.NEXT_R2_SECRET_KEY!,
  },
  endpoint: process.env.NEXT_R2_ENDPOINT!, // Set the R2 endpoint
});

console.log(process.env.NEXT_R2_ACCESS_KEY);


export const UploadToCloudflare = async (formData: FormData) => {
  try {
    const file: File = formData.get('file') as File;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create the S3 PutObjectCommand
    const putObjectCmd = new PutObjectCommand({
      Bucket: 'codejam', // Replace with your actual bucket name
      Key: file.name, // Use the file name as the object key
      Body: buffer,
    });

    // Send the request to Cloudflare R2
    const res = await r2.send(putObjectCmd);

    console.log('File uploaded successfully:', res);
    return res; // Return response if needed
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file.');
  }
};
