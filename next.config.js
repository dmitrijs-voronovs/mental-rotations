/** @type {import('next').NextConfig} */
const withTM = require("next-transpile-modules")([
  "@babylonjs/core",
  "dat.gui",
]);

const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;

module.exports = withTM({
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/tests/(.*).png",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_YEAR_IN_SECONDS}, s-maxage=${ONE_YEAR_IN_SECONDS}`,
          },
        ],
      },
    ];
  },
});
