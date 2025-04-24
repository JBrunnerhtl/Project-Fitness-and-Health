function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);


    const icon = document.getElementById('darkModeIcon');
    const text = document.getElementById('darkModeText');

    if (isDarkMode) {
        icon.src = "../icones/bx--sun.png";
        text.textContent = "Light Mode";
    } else {
        icon.src = "../icones/bx--moon.png";
        text.textContent = "Dark Mode";
    }


    const cards = document.querySelectorAll('.card, .form-container, .explanation-container');
    cards.forEach(card => {
        if (isDarkMode) {
            card.style.backgroundColor = '#2d2d2d';
            card.style.color = '#e0e0e0';
            card.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, span').forEach(text => {
                text.style.color = '#e0e0e0';
            });
        } else {
            card.style.backgroundColor = '#F6E8D5';
            card.style.color = '';
            card.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, span').forEach(text => {
                text.style.color = '';
            });
        }
    });
}

// Initialisierung
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeIcon').src = "../icones/bx--sun.png";
        document.getElementById('darkModeText').textContent = "Light Mode";

        // Cards initial anpassen
        document.querySelectorAll('.card, .form-container, .explanation-container').forEach(card => {
            card.style.backgroundColor = '#2d2d2d';
            card.style.color = '#e0e0e0';
            card.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, span').forEach(text => {
                text.style.color = '#e0e0e0';
            });
        });
    }

    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
});