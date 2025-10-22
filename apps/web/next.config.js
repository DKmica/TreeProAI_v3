/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Fallback for older Next versions
    turbo: {
      root: __dirname,
    },
  },
  // Next 16+
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;