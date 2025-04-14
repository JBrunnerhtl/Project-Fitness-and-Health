
document.addEventListener('DOMContentLoaded', function() {
    applyLanguage();
});


function setLanguage(lang) {
    localStorage.setItem('selectedLanguage', lang);
    translatePage(lang);
}


async function translatePage(targetLang) {
    const sourceLang = targetLang === 'en' ? 'de' : 'en'; //
    const elements = document.querySelectorAll('[data-translate="true"]');

    for (const element of elements) {
        const originalText = element.textContent.trim();
        if (!originalText) continue;

        try {
            element.textContent = await translateWithMyMemory(originalText, sourceLang, targetLang);
        } catch (error) {
            console.error("Übersetzung fehlgeschlagen:", error);
        }
    }
}


async function translateWithMyMemory(text, sourceLang, targetLang) {

    const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
    );

    if (!response.ok) {
        throw new Error("API-Anfrage fehlgeschlagen");
    }

    const data = await response.json();

    return data.responseData?.translatedText || text;
}


function applyLanguage() {
    const savedLang = localStorage.getItem('selectedLanguage') || 'de';
    document.documentElement.lang = savedLang;
    translatePage(savedLang);
}