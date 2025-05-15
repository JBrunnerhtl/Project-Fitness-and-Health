let currentLanguage = 'de';


function setLanguage(lang) {
    let previousLanguage = currentLanguage;

    currentLanguage = lang;
    localStorage.setItem('language', lang); // Sprache speichern

    // Alle Elemente mit data-key übersetzen
    /*
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        console.log("element: " + element);
        element.textContent = element[lang][key] || key; // Fallback, falls Übersetzung fehlt
    });*/
    translatePage(previousLanguage).then()
}


async function translatePage(previousLanguage = "de") {
    const elements = document.querySelectorAll('.translate-text');
    const texts = Array.from(elements).map(el => el.textContent.trim());
    const uniqueTexts = [...new Set(texts)];


    const translations = await translateTexts(uniqueTexts, previousLanguage, currentLanguage);


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
            console.log(translationMap[text]);
        } catch (error) {

            translationMap[text] = text;
        }
    }

    return translationMap;
}
/*
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('language') || 'de';
    setLanguage(savedLanguage);
});*/