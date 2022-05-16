/** @type {import('next').NextConfig} */
const withTM = require("next-transpile-modules")([
  "@babylonjs/core",
  "dat.gui",
]);

module.exports = withTM({
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/tests/(.*).png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
        ],
      },
    ];
  },
});
