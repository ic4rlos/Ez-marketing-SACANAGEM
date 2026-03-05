/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,
  reactStrictMode: true,

  // 🔥 CORREÇÃO DO ANTD
  transpilePackages: ["antd", "@ant-design/icons", "rc-util"],
};

export default nextConfig;
