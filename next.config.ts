import type { NextConfig } from "next";
import * as path from "path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve("../.."),
  },
};

export default withNextIntl(nextConfig);
