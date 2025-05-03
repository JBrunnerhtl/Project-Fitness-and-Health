//auth0 service
import { createAuth0Client } from '@auth0/auth0-spa-js';
import { auth0Config } from './auth0-config.js';

let auth0Client = null;

export const initAuth0 = async () => {
    auth0Client = await createAuth0Client(auth0Config);

    if (window.location.search.includes('code=')) {
        await auth0Client.handleRedirectCallback();
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    return auth0Client;
};

export const getAuth0Client = () => auth0Client;