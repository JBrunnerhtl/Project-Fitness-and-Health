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


const cleanText = text => text.replace(/►/g, "").trim();

async function translatePage(previousLanguage = "de") {
    const elements = document.querySelectorAll('.translate-text');
    const texts = Array.from(elements).map(el => cleanText(el.textContent));
    const uniqueTexts = [...new Set(texts)];

    const translations = await translateTexts(uniqueTexts, previousLanguage, currentLanguage);

    elements.forEach(element => {
        let originalText = cleanText(element.textContent);
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

    for (let text of texts) {
        text = cleanText(text);
        if (!text) {
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
            translationMap[text] = cleanText(data.responseData?.translatedText || text);
        } catch (error) {
            translationMap[text] = text;
        }
    }

    return translationMap;
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('language') || 'de';
    setLanguage(savedLanguage);
});