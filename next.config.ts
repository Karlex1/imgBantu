
import type {NextConfig} from 'next';
// import {withGenkit} from '@genkit-ai/next'; // Temporarily commented out

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  // Add allowed development origins
  allowedDevOrigins: [
    'http://6000-firebase-studio-1747541059422.cluster-htdgsbmflbdmov5xrjithceibm.cloudworkstations.dev',
    'https://6000-firebase-studio-1747541059422.cluster-htdgsbmflbdmov5xrjithceibm.cloudworkstations.dev',
    'http://9000-firebase-studio-1747541059422.cluster-htdgsbmflbdmov5xrjithceibm.cloudworkstations.dev',
    'https://9000-firebase-studio-1747541059422.cluster-htdgsbmflbdmov5xrjithceibm.cloudworkstations.dev',
  ],
};

// export default withGenkit(nextConfig); // Temporarily commented out
export default nextConfig; // Exporting the plain config for now
