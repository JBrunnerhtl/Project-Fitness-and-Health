/*const { auth } = require('express-openid-connect');

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'FiHWZ1JcY6bf-3cpbFHVyRnM93lfYTeVm4xi2o3T5Frjr_llpaLDp1acfhtMgQuj',
    baseURL: 'http://localhost:3000',
    clientID: 'X57y86qMIx3CaxUgYzMcSNOB8fxkRLAX',
    issuerBaseURL: 'https://dev-mxq3wnna1k2lh5ot.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});*/

const { auth } = require('express-oauth2-jwt-bearer');
app.use(
    auth({
        issuerBaseURL: 'https://dev-mxq3wnna1k2lh5ot.us.auth0.com',
        audience: 'fitness-and-health-api',
        secret: 'FiHWZ1JcY6bf-3cpbFHVyRnM93lfYTeVm4xi2o3T5Frjr_llpaLDp1acfhtMgQuj',
        tokenSigningAlg: 'HS256',
    })
);

