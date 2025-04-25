import { createAuth0Client } from "https://cdn.jsdelivr.net/npm/@auth0/auth0-spa-js@2.0.4/dist/auth0-spa-js.production.js";

export const createClient = () =>
    createAuth0Client({
        domain: "dev-mxq3wnna1k2lh5ot.us.auth0.com",
        clientId: "7EcXwMqBk0zqRYks6sWNE4kqXOoTWdVI",
        authorizationParams: {
            redirect_uri: window.location.origin,
        },
    });


const auth0 = await createClient();

if (window.location.search.includes("code=")) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
}

const isAuthenticated = await auth0.isAuthenticated();

if (isAuthenticated) {
    const user = await auth0.getUser();
    document.getElementById("user-name").textContent = user.name;
    document.getElementById("user-pic").src = user.picture;
    document.getElementById("user-info").style.display = "block";
    document.getElementById("login").style.display = "none";
    document.getElementById("logout").style.display = "inline-block";
}

document.getElementById("login").addEventListener("click", () => auth0.loginWithRedirect());
document.getElementById("logout").addEventListener("click", () =>
    auth0.logout({ returnTo: window.location.origin })
);
