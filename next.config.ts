import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/2024/07/09/953",
        destination: "/blog/attualita",
        permanent: true,
      },
      {
        source: "/2024/07/09/953/",
        destination: "/blog/attualita",
        permanent: true,
      },
      {
        source: "/events/:slug",
        destination: "/calendario/:slug",
        permanent: true,
      },
      {
        source: "/events/:slug/",
        destination: "/calendario/:slug",
        permanent: true,
      },
      {
        source: "/attualita",
        destination: "/blog",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
