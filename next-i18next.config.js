const path = require("path");

/** @type {import("next-i18next").UserConfig} **/
module.exports = {
  i18n: {
    locales: ["en", "lv", "ru"],
    defaultLocale: "en",
  },
  nsSeparator: "|",
  ns: ["common", "emotions", "depression", "other", "all"],
  defaultNS: "common",
  localePath: path.resolve("./public/locales"),
};
