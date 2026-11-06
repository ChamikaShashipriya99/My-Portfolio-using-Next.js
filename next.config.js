/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['three'],
    poweredByHeader: false,
    images: { formats: ['image/webp'], remotePatterns: [
        { protocol: 'https', hostname: 'raw.githubusercontent.com', pathname: '/ChamikaShashipriya99/**' },
        { protocol: 'https', hostname: 'opengraph.githubassets.com', pathname: '/**' },
    ] },
};

module.exports = nextConfig;
