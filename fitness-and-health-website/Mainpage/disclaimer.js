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

import { initAuth0, getAuth0Client } from "All/Auth/auth0-service";


const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const userInfo = document.getElementById("user-info");


(async () => {
    const auth0 = await initAuth0();
    updateUI(auth0);


    loginBtn.addEventListener("click", () => {
        auth0.loginWithRedirect();
    });

    logoutBtn.addEventListener("click", () => {
        auth0.logout({
            logoutParams: {
                returnTo: window.location.origin,
            },
        });
    });
})();


async function updateUI(auth0) {
    const isLoggedIn = await auth0.isAuthenticated();

    loginBtn.style.display = isLoggedIn ? "none" : "block";
    logoutBtn.style.display = isLoggedIn ? "block" : "none";

    if (isLoggedIn) {
        const user = await auth0.getUser();
        userInfo.innerHTML = `
      <h3>${user.name}</h3>
      <p>${user.email}</p>
      <img src="${user.picture}" width="50">
    `;
    } else {
        userInfo.innerHTML = "Nicht eingeloggt";
    }
}