/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['three'],
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'github.com' },
            { protocol: 'https', hostname: 'raw.githubusercontent.com' },
            { protocol: 'https', hostname: 'opengraph.githubassets.com' },
            { protocol: 'https', hostname: 'via.placeholder.com' },
        ],
    },
};

module.exports = nextConfig;
