/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    HUME_API_KEY: process.env.HUME_API_KEY,
    HUME_SECRET_KEY: process.env.HUME_SECRET_KEY,
    HUME_CONFIG_ID_1: process.env.HUME_CONFIG_ID_1,
    HUME_CONFIG_ID_2: process.env.HUME_CONFIG_ID_2,
    HUME_CONFIG_ID_3: process.env.HUME_CONFIG_ID_3,
  },
  /* config options here */
};

export default nextConfig;
