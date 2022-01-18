/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(["@babylonjs/core", "dat.gui"]);

module.exports = withTM({
  reactStrictMode: true
})