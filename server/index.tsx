const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require("express"),
  bodyParser = require("body-parser"),
  swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");
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
// const cleanSessions = require('./cleanSessions');
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

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LogRocket Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

//Function to hash password
function hashPassword(password) {
  return (cryptoJs.SHA256(password).toString());
}

//Function to generate token
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}

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

//Use session

const specs = swaggerJsdoc(options);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);
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
//Clean sessions
// cleanSessions();

//Route for check if user can connect or not
app.post('/api/login', async (req, res) => {
  //Get data of user if email exist
  const user = await prisma.users.findUnique({
    where: {
      email: req.body.email,
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      password: true,
      description: true,
      status: true,
      image: {
        select: {
          path: true
        }
      }
    }
  });
  //Compare password if user exist
  if (user == null) {
    res.send("null");
    return;
  } else if (user?.status == 0) {
    res.send("disable");
    return;
  } else if (hashPassword(req.body.password) != user.password) {
    res.send("null");
    return;
  }
  delete user.password;
  //Create token and add user_id and token in the session
  delete user.password;
  const accessToken = generateAccessToken(user);

  req.session.user_id = user.id;
  req.session.token = accessToken;
  req.session.save();

  res.send('ok');

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
  res.send(req.user);
});

app.get('/api/user/id', authenticateToken, async (req, res) => {
  const user = await prisma.users.findUnique({
    where: {
      id: req.user.id,
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      password: true,
      description: true,
      status: true,
      image: {
        select: {
          path: true
        }
      }
    }
  });
  res.send(user);
});

app.post('/api/update/user/', authenticateToken, async (req, res) => {
  const result = await prisma.users.update({
    where: {
      id: parseInt(req.body.id)
    },
    data: {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      description: req.body.description
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      password: true,
      description: true,
      status: true,
      image: {
        select: {
          path: true
        }
      }
    }
  });
  req.user = result;
  console.log('RESULT', result);
  console.log('REQ.USER', req.user)
  res.send(result);
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

app.get('/api/get/marks', async (req, res) => {
  try {
    const result = await prisma.$queryRaw`
        SELECT mark
        FROM models
        GROUP BY mark
      `;
    res.send(result);
  } catch (error) {
    console.error(error);
  }
});

app.post('/api/get/models', async (req, res) => {
  console.log('body', req.body, req.body.mark);
  try {
    const result = await prisma.models.findMany({
      where: {
        mark: req.body.mark
      },
      select: {
        model: true
      }
    });
    console.log('the result', result)
    res.send(result);
  } catch (error) {
    console.error(error);
  }
});
app.get('/api/logout', (req, res) => {
  console.log('sessions', req.session);
  req.session.destroy();
  console.log('session destroy', req.session);
  res.redirect('/');
});

app.get('*', (req, res) => res.sendFile(path.resolve('dist', 'index.html')));

app.listen(port, function () {
  console.log('App listening on port: ' + port);
});








