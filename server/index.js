const { faker } = require("@faker-js/faker");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require("express"),
  bodyParser = require("body-parser"),
  swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");
const swaggerFile = require('../swagger_output.json');
const path = require('path');
const app = express();
const jwt = require('jsonwebtoken');
const multer = require("multer");
const sessions = require('express-session');
const cryptoJs = require('crypto-js');
var FileStore = require('session-file-store')(sessions);
const port = process.env.PORT || 3001;
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');
const socket = require('./socket');
const { SHA256 } = require('crypto-js');
// const cleanSessions = require('./cleanSessions');
const mockResponse = {
  foo: 'bar',
  bar: 'foo'
};

const usersRouter = require('./routes/users');
const mobileRouter = require('./routes/mobile');
const citiesRouter = require('./routes/cities');
const imagesRouter = require('./routes/images');
const vehiclesRouter = require('./routes/vehicles');
const viewsRouter = require('./routes/views');
const modelsRouter = require('./routes/models');
const routesRouter = require('./routes/routes');
const createRouter = require('./routes/routes');
const noticesRouter = require('./routes/notices');
const userHasRouteRouter = require('./routes/userHasRoute');
const messagesRouter = require('./routes/messages');

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
    // openapi: "3.0.0",
    info: {
      title: "Documentation for ainori API",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
    },
    schemes: "http",
    servers: [
      {
        url: "http://localhost:3001/",
      },
    ],
  },
  apis: ["./routes/*.yaml"],
};

//Function to hash password
function hashPassword(password) {
  return (cryptoJs.SHA256(password).toString());
}

//Function to generate token
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '84000s' });
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

const storageVehicles = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/vehicles");
  },
  filename: function (req, file, cb, res) {
    const splitFile = file.originalname.split('.');
    const newName = uuidv4();
    cb(null, newName + '.' + splitFile[1]);
  },
});
const uploadVehicles = multer({ storage: storageVehicles });
const uploadPut = multer();
const http = require('http').Server(app);
//Use session

// const specs = swaggerJsdoc(options);

// app.use(
//   "/api-docs",
//   swaggerUi.serve,
//   swaggerUi.setup(specs)
// );

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile)
);

app.use(bodyParser.json());
app.use(session);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.disable("x-powered-by");
//Other use
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static('public', { etag: false }));
app.use('/', express.static('dist', { etag: false }));
app.get('/', (req, res) => {
  res.send(mockResponse);
});
//Clean sessions
// cleanSessions();
const socketIO = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3001"
  }
});

app.use('/city', citiesRouter);
app.use('/mobile', mobileRouter);
app.use('/image', imagesRouter);
app.use('/user', usersRouter);
app.use('/vehicles', vehiclesRouter);
app.use('/model', modelsRouter);
app.use('/route', routesRouter);
app.use('/userHasRoute', userHasRouteRouter);
app.use('/views', viewsRouter);
app.use('/create', createRouter);
app.use('/notices', noticesRouter)
app.use('/messages', messagesRouter)


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.post('/login', async (req, res) => {
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
  user.token = accessToken;
  res.send(user);

});

//Route for check if user can connect or not
app.post('/forgot', async (req, res) => {
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

app.post('/valide/link', async (req, res) => {
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
app.put('/forgot/update', async (req, res) => {
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


socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('message', (data) => {
    // data.sender = req.se.id;
    // console.log(data);
    socketIO.emit('messageResponse', data);
  });

  socket.on('countMessage', (data) => {
    console.log(data);

    socketIO.emit('notif', data);
  });

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });
});


app.get('*', (req, res) => res.sendFile(path.resolve('dist', 'index.html')));

http.listen(port, function () {
  console.log('App listening on port: ' + port);
});

