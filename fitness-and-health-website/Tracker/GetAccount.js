import { initializeAuth0Client} from '../All/Auth/auth0.js';
let auth0Client = null;

async function getCurrentAuth0User() {
    if (!auth0Client) {
        auth0Client = await initializeAuth0Client();
    }
    const user = await auth0Client.getUser();
    return user;
}


getCurrentAuth0User().then(user => {
    if (user) {
        console.log("Eingeloggter User:", user);
    } else {
        console.log("Niemand ist eingeloggt.");
    }
});