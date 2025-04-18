// translate.js


document.addEventListener('DOMContentLoaded', function () {
    applyLanguage();
});


function setLanguage(lang) {
    localStorage.setItem('selectedLanguage', lang);
    translatePage(lang);
}


async function translatePage(targetLang) {
    const elements = document.querySelectorAll('[data-translate="true"]');
    const microsoftApiKey = '5df1f52fd4mshc8d2ad2b5cf104bp1de614jsn051b11ab2c0a';
    const yandexApiKey = '5df1f52fd4mshc8d2ad2b5cf104bp1de614jsn051b11ab2c0a';


    for (const element of elements) {
        if (!element.dataset.original) {
            element.dataset.original = element.textContent.trim();
        }
        const originalText = element.dataset.original;


        if (!originalText) continue;



        const detectedLang = await detectLanguage(originalText, yandexApiKey);
        if (!detectedLang) {
            console.warn("Sprache konnte nicht erkannt werden. Übersetzung übersprungen.");
            continue;
        }



        if (detectedLang !== targetLang) {
            try {
                element.textContent = await translateWithMicrosoft(originalText, detectedLang, targetLang, microsoftApiKey);
            } catch (error) {
                console.error("Übersetzung fehlgeschlagen:", error);
            }
        } else {
            console.log("Text ist bereits in der Zielsprache. Keine Übersetzung nötig.");
        }
    }
}


async function translateWithMicrosoft(text, sourceLang, targetLang, apiKey) {
    const url = 'https://microsoft-translator-text.p.rapidapi.com/translate?api-version=3.0&to=' + targetLang +
        '&from=' + sourceLang;


    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com'
        },
        body: JSON.stringify([{
            "Text": text
        }])
    };


    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data[0].translations[0].text;
    } catch (error) {
        console.error("Microsoft Translation API error:", error);
        return text;
    }
}


function applyLanguage() {
    const savedLang = localStorage.getItem('selectedLanguage') || 'de';
    document.documentElement.lang = savedLang;
    translatePage(savedLang);
}
