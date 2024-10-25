/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_IMAGE_URL: "https://fakeimg.pl/500x500/cccccc",
  },
  images: {
    domains: ["picsum.photos", "fakeimg.pl", "res.cloudinary.com"], // Add your allowed domains here
  },
};

export default nextConfig;
