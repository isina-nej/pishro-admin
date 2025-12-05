/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "picsum.photos", "teh-1.s3.poshtiban.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: ""
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
        port: ""
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "teh-1.s3.poshtiban.com", // S3 endpoint اگر لازم است
        pathname: "/**"
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/images/courses/placeholder.png',
        destination: '/images/courses/placeholder.svg',
      },
    ];
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
};

export default nextConfig;
