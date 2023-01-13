const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const express = require('express');
const path = require('path');
const app = express();
const jwt = require('jsonwebtoken');
const sessions = require('express-session');
const redirect = require('express-redirect');

var FileStore = require('session-file-store')(sessions);
const port = process.env.PORT || 3001;
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');
const mockResponse = {
  foo: 'bar',
  bar: 'foo'
};
require('dotenv').config();
redirect(app);

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

  //Get data of user if email exist
  const user = await prisma.users.findUnique({
    where: {
      email: req.body.email,
    },
  });

  //Compare password if user exist
  if (user == null) {
    res.send("Identifiant invalide");
    return;
  } else if (req.body.password != user.password) {
    res.send("Identifiant invalide");
    return;
  }

  //Create token and add user_id and token in the session
  const accessToken = generateAccessToken(user);
  req.session.user_id = user.id;
  req.session.token = accessToken;
  req.session.save();
  res.send('Connexion réussi');

});

//Get user data
app.get('/api/user', authenticateToken, (req, res) => {
  res.send(req.user);
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
// GET DATA 
// app.get('/api/get/userByEmail/:email', async (req, res) => {
//     const result = await prisma.users.findMany({
//         where: {
//             email: req.params.email 
//         },
//     })
//     res.send(result);
// });

// // for get user [ params  (email) and (password) ] in SingIn.js  10/12/2022 Thomas 
// app.get('/api/get/loginUserSecure/:email/:password', async (req, res) => {
//   const users_login = await prisma.users.findMany(
//     {
//       select: {
//         id: true,
//         firstname: true,
//         lastname:true,
//         email:true,
//         status:true,
//         description:true,
//         role : true ,
//         image :true ,
//       },
//       where: {
//         email: req.params.email,
//         password: req.params.password,
//         status: true,
//       },
//     }
//   )
//   res.send(users_login);
// });

// // UPDATE DATA
// app.get('/api/update/password/:id/:password', async (req, res) => {
//     const result = await prisma.users.update({
//         where: { 
//             id: 1 
//         },
//         data: { password: req.params.password },
//     })
//     res.send(result);
// });


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








