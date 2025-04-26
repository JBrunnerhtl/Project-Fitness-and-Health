// Auth0-Konfiguration
const auth0Config = {
    domain: "dev-mxq3wnna1k2lh5ot.us.auth0.com",
    client_id: "7EcXwMqBk0zqRYks6sWNE4kqXOoTWdVI",
    redirect_uri: window.location.origin
};


let auth0Client;

async function initAuth0() {

    auth0Client = await window.auth0.createAuth0Client(auth0Config);


    updateUI();


    document.getElementById("login").addEventListener("click", login);
    document.getElementById("logout").addEventListener("click", logout);
}


async function login() {
    await auth0Client.loginWithRedirect({
        redirect_uri: window.location.origin
    });
}


async function logout() {
    await auth0Client.logout({
        returnTo: window.location.origin
    });
}


async function updateUI() {
    const isLoggedIn = await auth0Client.isAuthenticated();

    if (isLoggedIn) {

        const user = await auth0Client.getUser();


        document.getElementById("login").style.display = "none";
        document.getElementById("logout").style.display = "block";
        document.getElementById("user-info").style.display = "block";
        document.getElementById("user-name").textContent = user.name;
        document.getElementById("user-pic").src = user.picture;
    } else {

        document.getElementById("login").style.display = "block";
        document.getElementById("logout").style.display = "none";
        document.getElementById("user-info").style.display = "none";
    }
}


window.addEventListener("load", initAuth0);


(async function handleRedirectCallback() {
    if (window.location.search.includes("code=")) {
        await auth0Client.handleRedirectCallback();
        window.history.replaceState({}, document.title, "/");
        updateUI();
    }
})();