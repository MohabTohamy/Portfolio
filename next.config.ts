import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pages removed in the 2026 rebuild. Old links in CVs and search results land on the work page.
  async redirects() {
    return ["/tools", "/map-demo", "/dashboard"].map((source) => ({
      source,
      destination: "/projects",
      permanent: true,
    }));
  },
};

export default nextConfig;
