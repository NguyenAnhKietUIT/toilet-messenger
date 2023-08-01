/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    swcPlugins: [['next-superjson-plugin', {}]],
  },
  images: {
    domains: [
      'res.cloudinary.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'scontent.fsgn5-10.fna.fbcdn.net',
      'scontent.fsgn5-11.fna.fbcdn.net',
    ],
  },
};

module.exports = nextConfig;
