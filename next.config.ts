import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
   allowedDevOrigins: [
    "http://localhost:3000",
   ]
  
};

export default nextConfig;
