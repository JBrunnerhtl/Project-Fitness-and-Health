
import { auth0Config } from './config.js';

let auth0Client;
const LOGIN_BUTTON_ID = "login-button";


const initializeAuth0Client = async () => {
    if (auth0Client) return auth0Client;


    try {

        if (window.auth0 && typeof window.auth0.createAuth0Client === 'function') {
            console.log("Attempting to initialize Auth0 client using window.auth0.createAuth0Client");
            auth0Client = await window.auth0.createAuth0Client({
                domain: auth0Config.domain,
                clientId: auth0Config.clientId,
                authorizationParams: {
                    redirect_uri: auth0Config.redirectUri,
                },
                cacheLocation: 'localstorage'
            });
        } else {
            console.error("Auth0 SDK (window.auth0.createAuth0Client) not found. Ensure the CDN script for Auth0 is loaded and executed before this script.");
            throw new Error("Auth0 SDK not loaded correctly");
        }


        console.log("Auth0 client initialized successfully.");
        return auth0Client;
    } catch (error) {
        console.error("Auth0 Client Initialization Error:", error);
        throw error;
    }
};


const handleAuth0Redirect = async () => {

    if (auth0Client && window.location.search.includes("code=") && window.location.search.includes("state=")) {
        try {
            console.log("Handling redirect callback...");
            await auth0Client.handleRedirectCallback();
            console.log("Redirect callback handled.");

            window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
            console.error("Error handling redirect callback:", error);
        }
    }
};


const updateUI = async () => {
    if (!auth0Client) {
        console.warn("Auth0 client not initialized, cannot update UI.");
        return;
    }

    const loginButtonSpan = document.getElementById(LOGIN_BUTTON_ID);
    if (!loginButtonSpan) {
        console.error(`Login button SPAN with ID '${LOGIN_BUTTON_ID}' not found.`);
        return;
    }

    const loginLinkElement = loginButtonSpan.closest('a');
    if (!loginLinkElement) {
        console.error(`Parent <a> tag for login button span ('${LOGIN_BUTTON_ID}') not found.`);
        return;
    }


    const newLoginLinkElement = loginLinkElement.cloneNode(true);
    loginLinkElement.parentNode.replaceChild(newLoginLinkElement, loginLinkElement);


    const newLoginButtonSpan = newLoginLinkElement.querySelector(`#${LOGIN_BUTTON_ID}`);
    if (!newLoginButtonSpan) {
        console.error(`Login button SPAN not found in cloned link element.`);
        return;
    }


    try {
        const isAuthenticated = await auth0Client.isAuthenticated();
        const user = isAuthenticated ? await auth0Client.getUser() : null;

        if (user) {
            console.log("User is authenticated:", user);
            newLoginButtonSpan.textContent = "Logout";
            newLoginLinkElement.removeEventListener('click', performLogin);
            newLoginLinkElement.addEventListener("click", performLogout);


        } else {
            console.log("User is not authenticated.");
            newLoginButtonSpan.textContent = "Login";
            newLoginLinkElement.removeEventListener('click', performLogout);
            newLoginLinkElement.addEventListener("click", performLogin);

        }

    } catch (error) {
        console.error("Error updating UI / checking user state:", error);
    }
};


const performLogin = async (event) => {
    if (event) event.preventDefault();

    if (!auth0Client) {
        console.error("Auth0 client not initialized for login.");
        return;
    }
    try {
        console.log("Attempting login with popup...");
        await auth0Client.loginWithPopup();
        console.log("Login popup action initiated/completed.");
        await updateUI();
    } catch (error) {
        console.error("Login Error:", error);

        if (error.message && error.message.toLowerCase().includes("popup closed")) {
            console.log("Login popup was closed by the user.");
        } else {

        }
    }
};


const performLogout = (event) => {
    if (event) event.preventDefault();

    if (!auth0Client) {
        console.error("Auth0 client not initialized for logout.");
        return;
    }
    try {
        console.log("Attempting logout...");
        auth0Client.logout({
            logoutParams: {
                returnTo: auth0Config.logoutRedirectUri
            }
        });

    } catch (error) {
        console.error("Logout Error:", error);
    }
};


const mainAuth = async () => {
    try {
        await initializeAuth0Client();
        await handleAuth0Redirect();
        await updateUI();
    } catch (error) {

        console.error("Failed to initialize Auth and update UI:", error);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mainAuth);
} else {
    mainAuth();
}