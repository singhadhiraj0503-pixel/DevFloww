/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // hostname: "static.vecteezy.com",
        hostname: "**",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
