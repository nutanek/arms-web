/** @type {import('next').NextConfig} */

const basePath = '';

const nextConfig = {
    assetPrefix: basePath,
    basePath,
    trailingSlash: true,
    reactStrictMode: false,
    swcMinify: true,
    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig;
