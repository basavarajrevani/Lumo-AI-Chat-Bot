import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
  async redirects() {
    return [
      // Example: Redirect old about page to new one
      // {
      //   source: '/about-us',
      //   destination: '/about',
      //   permanent: true,
      // },
    ]
  },
  async rewrites() {
    return [
      // Add your rewrites here
    ]
  },
};

export default nextConfig;
