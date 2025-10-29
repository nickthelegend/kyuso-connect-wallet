/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['ui-auth-modal'],
  experimental: {
    externalDir: true,
  }
}

module.exports = nextConfig