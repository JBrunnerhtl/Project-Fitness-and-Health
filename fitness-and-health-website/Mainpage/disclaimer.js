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
