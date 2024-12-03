import { S3Client } from "@aws-sdk/client-s3";


const r2 = new S3Client({
  region: 'auto', // Cloudflare R2 uses 'auto' for the region
  credentials: {
    accessKeyId: process.env.NEXT_R2_ACCESS_KEY!,
    secretAccessKey: process.env.NEXT_R2_SECRET_KEY!,
  },
  endpoint: process.env.NEXT_R2_ENDPOINT!, // Set the R2 endpoint
});


export default r2;
