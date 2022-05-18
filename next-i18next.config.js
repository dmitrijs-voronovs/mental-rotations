const path = require("path");

/** @type {import("next-i18next").UserConfig} **/
module.exports = {
  i18n: {
    locales: ["en", "lv", "ru"],
    defaultLocale: "en",
  },
  nsSeparator: "|",
  localePath: path.resolve("./public/locales"),
};
