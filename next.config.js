/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    basePath: '/thebrainiacs',
    assetPrefix: '/thebrainiacs/',
};

module.exports = nextConfig;
