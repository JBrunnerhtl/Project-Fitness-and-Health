import { createAuth0Client } from '@auth0/auth0-spa-js';
let auth0Client;

const initAuth0 = async () => {
    try {
        auth0Client = await createAuth0Client({
            domain: "dev-mxq3wnna1k2lh5ot.us.auth0.com",
            clientId: "X57y86qMIx3CaxUgYzMcSNOB8fxkRLAX",
            authorizationParams: {

                redirect_uri: "http://127.0.0.1:3000/fitness-and-health-website/Mainpage/",
            },
        });


        if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
            await auth0Client.handleRedirectCallback();
            window.history.replaceState({}, document.title, "/");
        }

        checkUser();
    } catch (error) {
        console.error("Auth0 Initialization Error:", error);
    }
};

const login = async () => {
    try {
        await initAuth0();

        await auth0Client.loginWithPopup();


        const user = await auth0Client.getUser();
        console.log("User Info:", user);

        checkUser();
    } catch (error) {
        console.error("Login Error:", error);
    }
};

const logout = () => {
    try {
        auth0Client.logout({
            returnTo: "http://127.0.0.1:3000/fitness-and-health-website/Mainpage/",
        });
    } catch (error) {
        console.error("Logout Error:", error);
    }
};

const checkUser = async () => {
    try {
        const user = await auth0Client.getUser();
        const loginButton = document.getElementById("login-button");


        loginButton.replaceWith(loginButton.cloneNode(true));
        const newLoginButton = document.getElementById("login-button");

        if (user) {
            newLoginButton.innerText = "Logout";
            newLoginButton.addEventListener("click", logout);
        } else {
            newLoginButton.innerText = "Login";
            newLoginButton.addEventListener("click", login);
        }
    } catch (error) {
        console.error("User Check Error:", error);
    }
};

