const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const express = require('express');
const path = require('path');
const app = express();
const jwt = require('jsonwebtoken');
const sessions = require('express-session');
const cryptoJs = require('crypto-js');
var FileStore = require('session-file-store')(sessions);
const port = process.env.PORT || 3001;
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');
const { SHA256 } = require('crypto-js');
const mockResponse = {
  foo: 'bar',
  bar: 'foo'
};

require('dotenv').config();

//Create base of session
const session = sessions({
  secret: "H1agUkaZpsznkbi63IECEBMGVHHREFHIZ13YMgpF8OLmT1UewNY78QE51qpA",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: false,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
  store: new FileStore({
    reapInterval: -1
  }),
});

function hashPassword(password){
  return(cryptoJs.SHA256(password).toString());
}
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}

//Use session
app.use(session);

app.disable("x-powered-by");
//Other use
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static('public', { etag: false }));
app.use('/', express.static('dist', { etag: false }));
app.get('/api', (req, res) => {
  res.send(mockResponse);
});

//Route for check if user can connect or not
app.post('/api/login', async (req, res) => {

  console.log(req.body);
  //Get data of user if email exist
  const user = await prisma.users.findUnique({
    where: {
      email: req.body.email,
    }
  });
  console.log('user', user);
  //Compare password if user exist
  if (user == null) {
    res.send("Identifiant invalide");
    return;
  } else if (hashPassword(req.body.password) != user.password) {
    res.send("Identifiant invalide");
    return;
  }

  //Create token and add user_id and token in the session
  delete user.password;
  const accessToken = generateAccessToken(user);
  req.session.user_id = user.id;
  req.session.token = accessToken;
  req.session.save();
  res.send('Connexion réussi');

});

app.post('/api/forgot', async (req, res) => {
  const user = await prisma.users.findUnique({
    where: {
      email: req.body.email,
    },
   
  });
  if (user == null) {
    res.send(false);
    return;
  } else {
    req.session.forgot = SHA256(user.email) + "$" + Date.now();
    req.session.email = user.email;
    const content = {
      user_name: user.firstname + " " + user.lastname,
      link: "localhost:3001/forgot/" + req.session.forgot,
      email: user.email,
    }
    res.send(content);
  }
});

app.post('/api/valide/link', async (req, res) => {
  const token = req.session.forgot;
  const tokenLink = (req.body.link.split('/forgot/')[1]);
  console.log('token', token, 'tokenLink', tokenLink);
  if (token == tokenLink) {
    const timestamp1 = tokenLink.split('$')[1];
    const timestamp2 = timestamp1 - (24 * 60 * 60 * 1000);
    const difference = timestamp1 - timestamp2;
    if (difference > 86400000) {
      res.send(false);
    } else {
      res.send(true);
    }
  } else {
    res.send(false);
  }
});
app.post('/api/forgot/update', async (req, res) => {
  try {
    const result = await prisma.users.update({
      where: {
        email: req.session.email,
      },
      data: {
        password: hashPassword(req.body.password1)
      }
    });
  } catch (e) {
    res.send('error');
  }
  delete req.session['email'];
  delete req.session['forgot'];
  res.send('success');

});
//Get user data
app.get('/api/user', authenticateToken, (req, res) => {
  delete req.user.password;
  console.log(req.user);
  res.send(req.user);
});

app.get('/api/update/userdata/:id/:firstname/:lastname/:email/:description', async (req, res) => {
  const result = await prisma.users.update({
      where: { 
          id: parseInt(req.params.id) 
      },
      data: { 
        firstname: req.params.firstname,
        lastname: req.params.lastname,
        email: req.params.email,
        description: req.params.description
      },
  })
  res.send(result);
});

//Check if user already connect or not
app.get('/api/check/user', (req, res) => {
  if (req.session.user_id) {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.get('/api/logout', (req, res) => {
  console.log('sessions', req.session);
  req.session.destroy();
  console.log('session destroy', req.session);
  res.redirect('/');
});

//Function for check if the token in session exist
function authenticateToken(req, res, next) {
  if (req.session.token == null) return res.send("Vous n'avez pas accès à cette page")

  jwt.verify(req.session.token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.send("Une erreur avec votre token")
    }
    req.user = user;
    next();
  });
}

app.get('*', (req, res) => res.sendFile(path.resolve('dist', 'index.html')));

app.listen(port, function () {
  console.log('App listening on port: ' + port);
});








