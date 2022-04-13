/* @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: false, // it should be false by default
  experimental: {
    reactRoot: true,
  },
  images: {
    domains: ["kebek.kz"],
  },
  i18n: {
    locales: ["ru", "kz"],
    defaultLocale: "ru",
    localeDetection: false,
  },

  env: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  compress: true,
};
