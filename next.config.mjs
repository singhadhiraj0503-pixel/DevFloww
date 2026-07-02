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
      // {
      //   protocol: "https",
      //   hostname: "lh3.googleusercontent.com",
      //   port: "",
      // },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
