let currentLanguage = 'de';


async function setLanguage(lang) {
    currentLanguage = lang;
    await translatePage();
}


async function translatePage() {
    const elements = document.querySelectorAll('.translate-text');
    const texts = Array.from(elements).map(el => el.textContent.trim());
    const uniqueTexts = [...new Set(texts)];


    const translations = await translateTexts(uniqueTexts, 'de', currentLanguage);


    elements.forEach(element => {
        const originalText = element.textContent.trim();
        if (translations[originalText]) {
            element.textContent = translations[originalText];
        }
    });
}


async function translateTexts(texts, sourceLang, targetLang) {
    const translationMap = {};


    if (sourceLang === targetLang) {

        texts.forEach(text => translationMap[text] = text);
        return translationMap;
    }

    for (const text of texts) {

        if (!text.trim()) {
            translationMap[text] = text;
            continue;
        }


        if (encodeURIComponent(text).length > 450) {
            translationMap[text] = text;
            continue;
        }

        try {
            const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                translationMap[text] = text;
                continue;
            }

            const data = await response.json();
            translationMap[text] = data.responseData?.translatedText || text;

        } catch (error) {

            translationMap[text] = text;
        }
    }

    return translationMap;
}

document.addEventListener('DOMContentLoaded', function() {

    const savedLanguage = localStorage.getItem('language') || 'de';
    setLanguage(savedLanguage);
});