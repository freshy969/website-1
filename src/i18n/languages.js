import en from "./en";
import fr from "./fr";
import pt from "./pt";
import ru from "./ru";
import zhCN from "./zh";
import nl from "./nl";

const languages = {
  en,
  fr,
  pt,
  ru,
  "zh-CN": zhCN,
  nl
};

export const languagesInfos = {
  en: {
    flag: "en",
    code: "en",
    name: "English"
  },
  fr: {
    flag: "fr",
    code: "fr",
    name: "French"
  },
  pt: {
    flag: "pt-BR",
    code: "pt",
    name: "Portuguese"
  },
  ru: {
    flag: "ru",
    code: "ru",
    name: "Russian"
  },
  "zh-CN": {
    flag: "zh-CN",
    code: "zh-CN",
    name: "Chinese Simplified"
  },
  nl: {
    flag: "nl",
    code: "nl",
    name: "Dutch"
  }
};

export default languages;
