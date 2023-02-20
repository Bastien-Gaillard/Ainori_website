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
const sessions = require('express-session');
const cryptoJs = require('crypto-js');
var FileStore = require('session-file-store')(sessions);
const port = process.env.PORT || 3001;
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');
const multer = require("multer");
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
    cb(null, cryptoJs.SHA256(splitFile[0]).toString() + '.' + splitFile[1]);
  },
});
const uploadVehicles = multer({ storage: storageVehicles });
const uploadPut = multer();

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


// *************************************
// ROUTES CITIES
// *************************************
app.post('/cities', authenticateToken, async (req, res) => {
  try {
    if (!!req.body.limit) {
      const result = await prisma.cities.findMany({
        take: !!req.body.limit && parseInt(req.body.limit)
      });
      res.send(result);
    } else {
      const result = await prisma.cities.findMany();
      res.send(result);
    }

  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
app.post('/city', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.cities.findMany({
      where: {
        name: req.body.name
      }
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
app.post('/city/id', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.cities.findUnique({
      where: {
        id: parseInt(req.body.id)
      }
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
app.post('/cities', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.cities.findMany();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
app.post('/cities/create', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.cities.create({
      data: {
        department_code: req.body.department_code,
        zip_code: req.body.zip_code,
        name: req.body.name,
        gps_lat: req.body.gps_lat,
        gps_lng: req.body.gps_lng
      }
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
app.put('/cities/update', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.cities.update({
      where: {
        id: parseInt(req.body.id)
      },
      data: {
        department_code: req.body.department_code,
        zip_code: req.body.zip_code,
        name: req.body.name,
        gps_lat: req.body.gps_lat,
        gps_lng: req.body.gps_lng
      }
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
app.delete('/cities/delete', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.cities.delete({
      where: {
        id: parseInt(req.body.id)
      },
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});


// *************************************
// ROUTES IMAGES
// *************************************

app.get("/images", async(req, res) => {
  try {
    const result = await prisma.images.findMany();
    res.send(result);
  } catch (error) {
    console.error(error);
  }
  res.status(400).send('Une erreur est survenue');

});

app.post("/upload", uploadVehicles.single("image"), (req, res) => {
  res.send("Image uploaded successfully");
});

app.post('/image/create', authenticateToken, async (req, res) => {

  const image = req.body.image.split('.')
  const imageInServe = cryptoJs.SHA256(image[0]).toString() + '.' + image[1];
  try {
    console.log('create image body', req.body)
    const result = await prisma.images.create({
      data: {
        path: req.body.path + '/' + imageInServe
      }
    });
    res.send(result);
  } catch (error) {
    console.error(error);
  }

});
// *************************************
// ROUTES USERS
// *************************************
//Get user data
app.get('/user/current/session', authenticateToken, (req, res) => {
  delete req.user.password;
  res.send(req.user);
});

app.get('/user/current/id', authenticateToken, async (req, res) => {
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
app.get('/users', async (req, res) => {
  try {
    const result = await prisma.users.findMany();
    delete result.password;
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue');
  }
});
//Check if user already connect or not
app.get('/user/check', (req, res) => {
  if (req.session.user_id) {
    res.send(true);
  } else {
    res.send(false);
  }
});
app.post('/user/id', authenticateToken, async (req, res) => {
  console.log('req body', req.body);
  const user = await prisma.users.findUnique({
    where: {
      id: parseInt(req.body.id),
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
  console.log('req', req, req.body)
});
app.post('/user/create', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.users.create({
      data: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashPassword(req.body.email),
        status: req.body.status === 'true' ? true : false,
        role_id: req.body.role === 'user' ? 1 : 2
      }
    });
    res.send(result);
  } catch (error) {
    console.log(error)
  }
});
app.put('/user/update', authenticateToken, async (req, res) => {
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
  res.send(result);
});
app.put('/user/update/password', authenticateToken, async (req, res) => {
  const result = await prisma.users.update({
    where: {
      id: parseInt(req.body.id)
    },
    data: {
      password: hashPassword(req.body.password),
    }
  });
  res.send(result);
});

app.put('/user/disable', authenticateToken, async (req, res) => {
  console.log(req);

  try {
    const result = await prisma.users.update({
      where: {
        id: parseInt(req.body.id)
      },
      data: {
        status: false,
      },
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
app.put('/user/enable', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.users.update({
      where: {
        id: parseInt(req.body.id)
      },
      data: {
        status: true,
      },
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
// delete user by id
app.delete('/user/delete', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.users.delete({
      where: {
        id: parseInt(req.body.id)
      }
    });
    res.send(result)
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue');
  }
});


// *************************************
// ROUTES VEHICLES
// *************************************

app.post('/vehicles/create', authenticateToken, async (req, res) => {
  try {
    console.log('/vehicles/create', req.body);
    const result = await prisma.users_vehicles.create({
      data: {
        user_id: req.user.id,
        name: req.body.name,
        available_seats: req.body.available_seats,
        color: req.body.color,
        lisence_plate: req.body.lisence_plate,
        model_id: req.body.models.id,
        image_id: !!req.body.images.id ? req.body.images.id : null,
      }
    });
    res.send(result);
  } catch (error) {
    console.error(error);
  }
});


// *************************************
// ROUTES MODELS
// *************************************
app.post('/model', authenticateToken, async (req, res) => {
  try {
    console.log(req.body);

    const result = await prisma.models.findFirst({
      where: {
        mark: req.body.mark,
        model: req.body.model
      }
    });
    res.send(result);
  } catch (error) {
    console.error(error);
  }
});
app.get('/marks', async (req, res) => {
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

app.post('/models', async (req, res) => {
  try {
    console.log(req.body);
    const result = await prisma.models.findMany({
      where: {
        mark: req.body.mark
      },
      select: {
        model: true
      }
    });
    res.send(result);
  } catch (error) {
    console.error(error);
  }
});

// *************************************
// ROUTES OTHER
// *************************************

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

  res.send('ok');

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
app.get('*', (req, res) => res.sendFile(path.resolve('dist', 'index.html')));

app.listen(port, function () {
  console.log('App listening on port: ' + port);
});


