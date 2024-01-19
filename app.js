const express = require('express');
const bodyParser = require('body-parser');
const { auth } = require('express-openid-connect');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');


const app = express();
app.use(express.json());

// Acces and authorization require for compatibility an App : CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// route configuration required for app authentication

  const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'ErQLGDpnU1CbrjJjev57mJ4yCK5d8GKztNwqUPHZdVJ-VcIO8RfHhHFJOQ5UhNDA',
    baseURL: 'http://localhost:3000/FirstAuth',
    clientID: 'nEGTVKscoVGGIB8RDSOOkw92kKbHKSS0',
    issuerBaseURL: 'https://dev-fabricerandrianaivo8.us.auth0.com'
  };
  
  // auth router attaches /login, /logout, and /callback routes to the baseURL
  app.use(auth(config));
  
  // req.isAuthenticated is provided from the auth router
  app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  });
  
  const { requiresAuth } = require('express-openid-connect');

  app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  });
  

  //config authentification necessary for API Facebook-passeport

  passport.use(new FacebookStrategy({
    clientID: '1052360452038100',
    clientSecret: '320516de0f5d8d0bedc33eadb5b553c3',
    callbackURL: "http://localhost:3000/FirstAuth"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/FirstAuth',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/FirstAuth/callback');
  });


// Creat the route necesary for Authentification API

app.post('/FirstAuth/callback',( req , res, next)=>{
    res.status(201).send('<h1>Page d\'acceuil<h1>');
    next(); 
})
app.get('/FirstAuth',( req , res, next)=>{
    res.status(201).send('<h1>Page de reception<h1>');
    next(); 
})
app.get('/FirstAuth/login',( req , res, next)=>{
    res.send('<h1>Vous êtes déconnectez , Veuillez vous reconnecter</h1>')    
    next(); 
})

module.exports = app;
