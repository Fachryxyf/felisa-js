// next.config.ts

import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
            {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
    ],
  },
}

export default config