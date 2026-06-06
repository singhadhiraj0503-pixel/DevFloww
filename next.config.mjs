/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pino", "pino-pretty"],
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
