/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
          port: "",
        pathname: "/t/p/**", // allow all TMDB images
      },
    ],
  },
};

module.exports = nextConfig;
