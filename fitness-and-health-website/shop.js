document.addEventListener('DocumentContentLoaded', () =>{  // dom takes a look that the code is runed if the html file is loaded

    const form = document.querySelector('form');// it searches for the first css element off form and stores it in the const form.

    form.addEventListener('submit', (event) => { // adds an event listener to the form that waits for a submit event
        event.preventDefault(); // prevent the reload of the page, it should run smooth
        const problem = document.getElementById('problem').value;
        const maxPrice = document.getElementById('max-price').value;
        const category = document.getElementById('category').value;

        const USER_DATA = {
            problem,
            maxPrice,
            category
        }
    })
});