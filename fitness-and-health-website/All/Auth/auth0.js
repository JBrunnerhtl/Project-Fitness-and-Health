
import { auth0Config } from './config.js'; // Assuming config.js is in the same directory as auth0.js

let auth0Client;
const LOGIN_BUTTON_ID = "login-button"; // The ID of the <span> inside the <a> tag

/**
 * Initializes the Auth0 client.
 */
const initializeAuth0Client = async () => {
    if (auth0Client) return auth0Client; // Already initialized


    try {
        // **** THIS IS THE KEY CHANGE ****
        if (window.auth0 && typeof window.auth0.createAuth0Client === 'function') {
            console.log("Attempting to initialize Auth0 client using window.auth0.createAuth0Client");
            auth0Client = await window.auth0.createAuth0Client({ // Use the namespaced version
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
        // **** END OF KEY CHANGE ****

        console.log("Auth0 client initialized successfully.");
        return auth0Client;
    } catch (error) {
        console.error("Auth0 Client Initialization Error:", error);
        throw error;
    }
};

/**
 * Handles the redirect callback from Auth0 if loginWithRedirect was used.
 */
const handleAuth0Redirect = async () => {
    // Check if auth0Client is initialized and if the URL contains redirect parameters
    if (auth0Client && window.location.search.includes("code=") && window.location.search.includes("state=")) {
        try {
            console.log("Handling redirect callback...");
            await auth0Client.handleRedirectCallback();
            console.log("Redirect callback handled.");
            // Clean the URL: remove code and state from query parameters
            window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
            console.error("Error handling redirect callback:", error);
        }
    }
};

/**
 * Updates the UI (login/logout button) based on the user's authentication state.
 */
const updateUI = async () => {
    if (!auth0Client) {
        console.warn("Auth0 client not initialized, cannot update UI.");
        return;
    }

    const loginButtonSpan = document.getElementById(LOGIN_BUTTON_ID); // The <span> element
    if (!loginButtonSpan) {
        console.error(`Login button SPAN with ID '${LOGIN_BUTTON_ID}' not found.`);
        return;
    }

    const loginLinkElement = loginButtonSpan.closest('a'); // Get the parent <a> tag
    if (!loginLinkElement) {
        console.error(`Parent <a> tag for login button span ('${LOGIN_BUTTON_ID}') not found.`);
        return;
    }

    // To safely update event listeners, clone the link, replace it, then get new references.
    const newLoginLinkElement = loginLinkElement.cloneNode(true); // Deep clone to include the span
    loginLinkElement.parentNode.replaceChild(newLoginLinkElement, loginLinkElement);

    // Get the span within the *newly cloned* link
    const newLoginButtonSpan = newLoginLinkElement.querySelector(`#${LOGIN_BUTTON_ID}`);
    if (!newLoginButtonSpan) {
        console.error(`Login button SPAN not found in cloned link element.`);
        return; // Should not happen if cloneNode(true) worked
    }


    try {
        const isAuthenticated = await auth0Client.isAuthenticated();
        const user = isAuthenticated ? await auth0Client.getUser() : null;

        if (user) {
            console.log("User is authenticated:", user);
            newLoginButtonSpan.textContent = "Logout"; // Update text on the span
            // newLoginButtonSpan.dataset.key = "logout"; // If using translate.js
            newLoginLinkElement.removeEventListener('click', performLogin); // Clean up old listener
            newLoginLinkElement.addEventListener("click", performLogout); // Add logout listener to the LINK

            // Optionally display user info
            // const userInfoDiv = document.getElementById("user-info");
            // if (userInfoDiv) userInfoDiv.textContent = `Logged in as ${user.name || user.email}`;
        } else {
            console.log("User is not authenticated.");
            newLoginButtonSpan.textContent = "Login"; // Update text on the span
            // newLoginButtonSpan.dataset.key = "login"; // If using translate.js
            newLoginLinkElement.removeEventListener('click', performLogout); // Clean up old listener
            newLoginLinkElement.addEventListener("click", performLogin); // Add login listener to the LINK

            // Clear user info
            // const userInfoDiv = document.getElementById("user-info");
            // if (userInfoDiv) userInfoDiv.textContent = '';
        }
        // If using translate.js, re-apply translations after text change if needed
        // if (typeof applyTranslations === 'function' && typeof currentLanguage === 'string') {
        //    applyTranslations(currentLanguage); // Or however your translate.js is invoked
        // }
    } catch (error) {
        console.error("Error updating UI / checking user state:", error);
    }
};

/**
 * Initiates the login process.
 */
const performLogin = async (event) => {
    if (event) event.preventDefault(); // Prevent default <a> tag navigation behavior

    if (!auth0Client) {
        console.error("Auth0 client not initialized for login.");
        return;
    }
    try {
        console.log("Attempting login with popup...");
        await auth0Client.loginWithPopup();
        console.log("Login popup action initiated/completed.");
        await updateUI(); // Update UI after successful login attempt
    } catch (error) {
        console.error("Login Error:", error);
        // If error.message is "Popup closed", it means user closed the popup.
        if (error.message && error.message.toLowerCase().includes("popup closed")) {
            console.log("Login popup was closed by the user.");
        } else {
            // Handle other errors
        }
    }
};

/**
 * Initiates the logout process.
 */
const performLogout = (event) => {
    if (event) event.preventDefault(); // Prevent default <a> tag navigation behavior

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
        // Note: After calling logout, the user is redirected.
        // The UI update for "Login" text will happen on the next page load after redirect.
    } catch (error) {
        console.error("Logout Error:", error);
    }
};

/**
 * Main function to initialize Auth0 and set up the page.
 * This should be called when the DOM is ready.
 */
const mainAuth = async () => {
    try {
        await initializeAuth0Client();
        await handleAuth0Redirect(); // Handle any redirect from Auth0 (e.g., if loginWithRedirect was used)
        await updateUI();            // Update UI based on current auth state
    } catch (error) {
        // Error should have been logged by initializeAuth0Client
        // You might want to display a user-friendly message on the page here
        console.error("Failed to initialize Auth and update UI:", error);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mainAuth);
} else {
    mainAuth();
}