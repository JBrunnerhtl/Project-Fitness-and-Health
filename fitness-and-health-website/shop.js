document.addEventListener('DocumentContentLoaded', () =>{  // dom takes a look that the code is runed if the html file is loaded

    const form = document.querySelector('form');// it searches for the first css element off form and stores it in the const form.
    if (!form) {
        console.error('Kein Formular gefunden!');
        return;
    }

    form.addEventListener('submit', (event) => { // adds an event listener to the form that waits for a submit event
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
    })
});