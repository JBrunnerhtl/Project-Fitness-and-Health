
import { createAuth0Client } from "@auth0/auth0-spa-js";
import { auth0Config } from "./auth0-config";

let auth0Client = null;
export const auth0Config = {
    domain: 'dev-mxq3wnna1k2lh5ot.us.auth0.com',
    clientId: '7EcXwMqBk0zqRYks6sWNE4kqXOoTWdVI',
    authorizationParams: {
        redirect_uri: window.location.origin
    }
};
export const initAuth0 = async () => {
    auth0Client = await createAuth0Client(auth0Config);


    if (window.location.search.includes("code=")) {
        await auth0Client.handleRedirectCallback();
        window.history.replaceState({}, document.title, "/");
    }

    return auth0Client;
};

export const getAuth0Client = () => auth0Client;