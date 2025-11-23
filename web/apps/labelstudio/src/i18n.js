// D:\label-studio\web\apps\labelstudio\src\i18n.js
console.log("--- i18n.js file has been loaded! ---"); // <--- 添加这句测试日志
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { en_US } from './locales/en/en-US.js';
import { zh_CN } from './locales/zh/zh-CN.js';

const resources = {
  'en-US': en_US,
  'zh-CN': zh_CN,
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh-CN', // <--- 强制使用中文进行测试
    fallbackLng: "en-US",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
