import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from 'components/locales/en-US';
import zh_tw from 'components/locales/zh-Hant-TW';

const resources = {
    en: {
        translation: en
    },
    zh_tw: {
        translation: zh_tw
    }
};

i18n.use(initReactI18next).init({
    resources, // 會是所有翻譯資源
    lng: 'zh_tw', // 預設語言
    fallbackLng: 'zh_tw', // 如果當前切換的語言沒有對應的翻譯則使用這個語言
    interpolation: {
        // 是否要讓字詞 escaped 來防止 xss 攻擊，這裡因為 React.js 已經做了，就設成 false即可
        escapeValue: false
    }
});

export default i18n;
