import { createAuth0Client } from './libs/auth0-spa-js/auth0-spa-js.production.js';


let auth0Client;

const initAuth0 = async () => {
    if (!window.createAuth0Client) {
        console.error('Auth0 SDK ist nicht korrekt geladen');
        return;
    }
    auth0Client = await createAuth0Client({
        domain: "dev-mxq3wnna1k2lh5ot.us.auth0.com",
        client_id: "X57y86qMIx3CaxUgYzMcSNOB8fxkRLAX",
        authorizationParams: {
            redirect_uri: window.location.href,
        },
    });
};

const login = async () => {
    await auth0Client.loginWithRedirect();
};

const logout = () => {
    auth0Client.logout({
        returnTo: window.location.href,
    });
};

const checkUser = async () => {
    const user = await auth0Client.getUser();
    if (user) {
        document.getElementById("login-button").innerText = "Logout";
        document.getElementById("login-button").addEventListener("click", logout);
    } else {
        document.getElementById("login-button").innerText = "Login";
        document.getElementById("login-button").addEventListener("click", login);
    }
};

const handleRedirectCallback = async () => {
    await auth0Client.handleRedirectCallback();
    checkUser();
};

if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
    handleRedirectCallback();
}

initAuth0().then(checkUser);