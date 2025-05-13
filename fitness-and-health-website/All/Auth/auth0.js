document.addEventListener("DOMContentLoaded", async () => {
    const auth0 = await createAuth0Client({
        domain: "dev-mxq3wnna1k2lh5ot.us.auth0.com",
        client_id: "X57y86qMIx3CaxUgYzMcSNOB8fxkRLAX",
        authorizationParams: {
            redirect_uri: window.location.origin,
            audience: "fitness-and-health-api" // falls du APIs schützt
        }
    });


    const loginButton = document.getElementById("login-button");
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        auth0.loginWithRedirect();
    });


    if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
        await auth0.handleRedirectCallback();
        window.history.replaceState({}, document.title, "/");
    }


    const isAuthenticated = await auth0.isAuthenticated();
    console.log("Eingeloggt:", isAuthenticated);
});