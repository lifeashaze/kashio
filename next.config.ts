import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["date-fns", "lucide-react", "recharts"],
  },
};

export default nextConfig;
