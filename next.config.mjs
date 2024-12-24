/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY,
  },
}

export default nextConfig;
