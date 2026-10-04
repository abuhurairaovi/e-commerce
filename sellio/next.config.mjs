/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "assets.thenorthface.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // এটি এখানে যোগ করে দিন
      },
    ]
  }
};

export default nextConfig;