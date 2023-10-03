/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        //it is used to pass complex objects like date objects
        swcPlugins: [["next-superjson-plugin", {}]],
    },
    images: {
        domains: [
            "res.cloudinary.com",
            "avatars.githubusercontent.com",
            "lh3.googleusercontent.com",
        ],
    },
};

module.exports = nextConfig;
