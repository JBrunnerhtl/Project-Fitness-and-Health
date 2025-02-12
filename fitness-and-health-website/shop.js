<<<<<<< HEAD
=======
document.addEventListener('DocumentContentLoaded', () =>{  // dom takes a look that the code is runed if the html file is loaded

    const form = document.querySelector('form');// it searches for the first css element off form and stores it in the const form.
    if (!form) {
        console.error('Kein Formular gefunden!');
        return;
    }

    form.addEventListener('submit', async (event) => { // adds an event listener to the form that waits for a submit event
        event.preventDefault(); // prevent the reload of the page, it should run smooth
        const problemInput = document.getElementById('problem').value;
        const maxPriceInput = document.getElementById('max-price').value;
        const categoryInput = document.getElementById('category').value;

        if (!problemInput || !maxPriceInput || !categoryInput) {
            console.error('Ein oder mehrere Formularfelder wurden nicht gefunden.');
            return;
        }
        const problem = problemInput.value.trim();
        const maxPrice = maxPriceInput.value.trim();
        const category = categoryInput.value.trim();

        if (!problem || !maxPrice || !category) {
            alert('Bitte füllen Sie alle Felder aus.');
            return;
        }
        const USER_DATA = {
            problem,
            maxPrice,
            category
        }
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `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`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    prompt: `User: Ich habe ein Problem mit ${USER_DATA.problem}. Ich möchte, dass es möglich ist, eine Lösung zu finden, die nicht mehr als ${USER_DATA.maxPrice} Euro kostet und in der Kategorie ${USER_DATA.category} liegt. \n\nAusgangslage:`,
                    max_tokens: 1000
                })
            });
            const result = await response.json()
        .
            response.json();
            console.log(result);
        } catch (error) {
            console.error(error);
            alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später nochmal.');
        }
    })
});
>>>>>>> a3c1816 (ich habe zwar einen api schlüssel hinzugefügt es passiert zurzeit aber noch nichts.)
