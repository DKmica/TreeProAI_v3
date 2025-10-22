const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly pin the Turbopack root so Next can resolve packages from the monorepo root.
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
};

module.exports = nextConfig;