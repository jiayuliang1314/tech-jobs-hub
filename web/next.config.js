/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['raw.githubusercontent.com'],
  },
  // 环境变量
  env: {
    INDEED_PUBLISHER_ID: process.env.INDEED_PUBLISHER_ID || 'YOUR_INDEED_ID',
    ZIPRECRUITER_AID: process.env.ZIPRECRUITER_AID || 'YOUR_ZR_ID',
    CJ_AFFILIATE_ID: process.env.CJ_AFFILIATE_ID || 'YOUR_CJ_ID',
    GITHUB_DATA_URL: process.env.GITHUB_DATA_URL || 'https://raw.githubusercontent.com/YOUR_USERNAME/greenhouse-jobs/main/data',
  },
}

module.exports = nextConfig

