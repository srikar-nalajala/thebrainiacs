/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    basePath: process.env.NODE_ENV === 'production' ? '/thebrainiacs' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/thebrainiacs/' : '',
};

module.exports = nextConfig;
