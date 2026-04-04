import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ik.imagekit.io' },
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'https', hostname: 'avatar.iran.liara.run' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }
    ],
  },
  allowedDevOrigins: ['nonpalpable-zayden-slangily.ngrok-free.dev'],
};

export default nextConfig;
