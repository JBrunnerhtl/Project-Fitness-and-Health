
    import { createAuth0Client } from "https://cdn.jsdelivr.net/npm/@auth0/auth0-spa-js@2.0.3/dist/auth0-spa-js.production.esm.js";

    let auth0Client;

    const initAuth0 = async () => {
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
    const loginButton = document.getElementById("login-button");
    if (user) {
    loginButton.innerText = "Logout";
    loginButton.addEventListener("click", logout);
} else {
    loginButton.innerText = "Login";
    loginButton.addEventListener("click", login);
}
};

    initAuth0().then(checkUser);
