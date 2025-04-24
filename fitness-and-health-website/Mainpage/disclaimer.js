document.addEventListener('DOMContentLoaded', function() {

    const disclaimerModalElement = document.getElementById('disclaimerModal');
    const acceptButton = document.getElementById('acceptDisclaimerBtn');
    const storageKey = 'disclaimerAccepted';


    if (!disclaimerModalElement || !acceptButton) {
        console.error('Disclaimer modal elements not found!');
        return;
    }


    if (typeof bootstrap === 'undefined' || typeof bootstrap.Modal === 'undefined') {
        console.error('Bootstrap Modal component not found. Ensure Bootstrap JS is loaded before disclaimer.js');
        return;
    }



    const disclaimerModal = new bootstrap.Modal(disclaimerModalElement, {
        keyboard: false,
        backdrop: 'static'
    });


    const accepted = sessionStorage.getItem(storageKey);


    if (accepted !== 'true') {
        console.log("Disclaimer not accepted in this session. Showing modal.");

        setTimeout(() => {
            disclaimerModal.show();
        }, 150);
    } else {
        console.log("Disclaimer already accepted in this session.");
    }


    acceptButton.addEventListener('click', function() {
        console.log("Disclaimer accepted by user.");

        sessionStorage.setItem(storageKey, 'true');
        disclaimerModal.hide();
    });



});

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
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
}


document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeIcon').src = "../icones/bx--moon";
        document.getElementById('darkModeText').textContent = "Light Mode";
    }


    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
});