
async function detectLanguage(text, apiKey) {
    const url = 'https://yandextranslatezakutynskyv1.p.rapidapi.com/detectLanguage';


    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'yandextranslatezakutynskyv1.p.rapidapi.com',
            'content-type': 'application/x-www-form-urlencoded'
        },
        body: `text=${encodeURIComponent(text)}` // Text als Parameter im Body
    };


    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result.language;
    } catch (error) {
        console.error("Fehler bei der Spracherkennung:", error);
        return null;
    }
}
