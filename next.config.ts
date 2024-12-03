import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental:{
    serverActions:{
      bodySizeLimit:"1.5GB",
    }
  },
  images:{
    remotePatterns:[
      {
        protocol:'https',
        hostname:'cdn.pixabay.com',
      },
      {
        protocol:'https',
        hostname:'e582c46fcb5cfe7bf3b638705d641064.r2.cloudflarestorage.com',
      },
      {
        protocol:'https',
        hostname:'img.freepik.com',
      },
      {
        protocol:'https',
        hostname:'cloud.appwrite.io',
      }
    ]
  }
};

export default nextConfig;
