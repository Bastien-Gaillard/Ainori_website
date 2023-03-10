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
const sessions = require('express-session');
const cryptoJs = require('crypto-js');
var FileStore = require('session-file-store')(sessions);
const port = process.env.PORT || 3001;
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');
const multer = require("multer");
const { SHA256 } = require('crypto-js');
const { v4: uuidv4 } = require('uuid');
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
    const newName = uuidv4();
    cb(null, newName + '.' + splitFile[1]);
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
app.get('/get/cities/name', async (req, res) => {
  try {
    const result = await prisma.$queryRaw`
        SELECT name
        FROM cities
        GROUP BY name
      `;
    res.send(result);
  } catch (error) {
    console.error(error);
  }
});
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
app.post('/city/zip_code/name', authenticateToken, async (req, res) => {
  try {
    console.log(req.body);
    const result = await prisma.cities.findFirst({
      where: {
        zip_code: req.body.code,
        name: req.body.name
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

app.get("/images", async (req, res) => {
  try {
    const result = await prisma.images.findMany();
    res.send(result);
  } catch (error) {
    console.error(error);
  }
  res.status(400).send('Une erreur est survenue');

});

app.post("/upload", uploadVehicles.single("image"), (req, res) => {
  res.send(req.file.path.split('\\')[3])
});

app.post('/image/create', authenticateToken, async (req, res) => {
  try {
    if (!!req.body.image) {
      const result = await prisma.images.create({
        data: {
          path: req.body.path + req.body.image
        }
      });
      res.send(result);
    }
  } catch (error) {
    console.error(error);
  }

});

// *************************************
// ROUTES USERS
// *************************************

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

app.put('/vehicles/update', authenticateToken, async (req, res) => {
  try {
    console.log('id:', req.body.id);
    if (!!req.body.images) {
      const result = await prisma.users_vehicles.update({
        where: {
          id: req.body.id
        },
        data: {
          user_id: req.user.id,
          name: req.body.name,
          available_seats: req.body.available_seats,
          color: req.body.color,
          lisence_plate: req.body.lisence_plate,
          image_id: req.body.images.id,

        }
      });
      res.send(result);
    } else {
      const result = await prisma.users_vehicles.update({
        where: {
          id: req.body.id
        },
        data: {
          user_id: req.user.id,
          name: req.body.name,
          available_seats: req.body.available_seats,
          color: req.body.color,
          lisence_plate: req.body.lisence_plate,
        }
      });
      res.send(result);
    }
  } catch (error) {
    console.error(error);
  }
});


// *************************************
// ROUTES MODELS
// *************************************
app.post('/model', authenticateToken, async (req, res) => {
  try {
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

  console.log('user', user);
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

// *************************************
// ROUTES ROUTES
// *************************************

app.get('/routes', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.routes.findMany();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
app.get('/routes/id', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.routes.findMany({
      where: {
        user_id: parseInt(req.user.id)
      },
      select: {
        id: true,
        route: {
          select: {
            firstname: true,
            lastname: true
          }
        },
        arrival_city: {
          select: {
            name: true
          }
        },
        departure_city: {
          select: {
            name: true
          }
        },
        departure_time: true,
        arrival_time: true,
        departure_date: true,
        remaining_seats: true,
        statuts: true
      }
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
app.post('/route', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.routes.findUnique({
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
app.get('/vehicules/user', authenticateToken, async (req, res) => {
  const cars = await prisma.users.findUnique({
    where: {
      id: req.user.id,
    },
    select: {
      vehicule: {
        select: {
          id: true,
          name: true,
          images: {
            select: {
              path: true
            }
          },
          models: {
            select: {
              mark: true,
              model: true
            }
          },
          color: true,
          lisence_plate: true,
          available_seats: true
        },
        where: {
          status: 1,
        }
      }
    }
  });
  res.send(cars);
});
app.post('/vehicules/id', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.users_vehicles.findUnique({
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

app.post('/vehicles/update/status', authenticateToken, async (req, res) => {
  const result = await prisma.users_vehicles.update({
    where: {
      id: parseInt(req.body.id)
    },
    data: {
      status: req.body.status,
    },
  });
  res.send(result);
});

app.post('/route/departure/arrival', authenticateToken, async (req, res) => {
  try {
    if (!!req.body.departure_city_id && !!req.body.arrival_city_id) {
      const result = await prisma.routes.findMany({
        where: {
          departure_city_id: parseInt(req.body.departure_city_id),
          arrival_city_id: parseInt(req.body.arrival_city_id)
        }
      });
      res.send(result);
    } else if (!!req.body.departure_city_id) {
      const result = await prisma.routes.findMany({
        where: {
          departure_city_id: parseInt(req.body.departure_city_id),
        }
      });
      res.send(result);
    } else if ((!!req.body.arrival_city_id)) {
      const result = await prisma.routes.findMany({
        where: {
          arrival_city_id: parseInt(req.body.arrival_city_id),
        }
      });
      res.send(result);
    } else {
      const result = await prisma.routes.findMany();
      res.send(result);
    }

  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
app.post('/route/create', authenticateToken, async (req, res) => {
  try {

    const departureTime = new Date(req.body.departure_time);
    const arrivalTime = new Date(req.body.arrival_time);
    const departureDate = new Date(req.body.departure_date);

    const result = await prisma.routes.create({
      data: {
        user_id: req.user.id,
        arrival_city_id: parseInt(req.body.arrival_city_id),
        departure_city_id: parseInt(req.body.departure_city_id),
        departure_time: departureTime,
        arrival_time: arrivalTime,
        departure_date: departureDate,
        vehicules_id: parseInt(req.body.vehicules_id),
        available_seats: parseInt(req.body.available_seats),
        remaining_seats: parseInt(req.body.remaining_seats),
        statuts: true,
      }
    });
    res.send(result)
    console.log(result)
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
app.put('/route/update', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.routes.update({
      where: {
        id: parseInt(req.body.id)
      },
      data: {
        user_id: req.body.user_id,
        arrival_city_id: req.body.arrival_city_id,
        departure_city_id: req.body.departure_city_id,
        departure_time: req.body.departure_time,
        arrival_time: req.body.arrival_time,
        departure_date: req.body.departure_date,
        available_seats: parseInt(req.body.available_seats),
        remaining_seats: parseInt(req.body.remaining_seats),
        statuts: req.body.statuts,
      }
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
app.put('/route/remainingSeats', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.routes.update({
      where: {
        id: parseInt(req.body.id)
      },
      data: {
        remaining_seats: parseInt(req.body.remaining_seats),
      }
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
app.put('/route/disable', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.routes.update({
      where: {
        id: parseInt(req.body.id)
      },
      data: {
        statuts: false,
      }
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
app.put('/route/enable', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.routes.update({
      where: {
        id: parseInt(req.body.id)
      },
      data: {
        statuts: true,
      }
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});

app.delete('/route/delete', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.routes.delete({
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

// *************************************
// ROUTES USER HAS ROUTES
// *************************************

app.get('/usersHasRoutes', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.users_has_routes.findMany();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
app.post('/usersHasRoute', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.users_has_routes.findUnique({
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
app.post('/userHasRoute/route', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.users_has_routes.findMany({
      where: {
        route_id: parseInt(req.body.route_id)
      }
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
app.post('/userHasRoute/user', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.users_has_routes.findMany({
      where: {
        user_id: parseInt(req.body.user_id)
      }
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
app.post('/userHasRoute/user/route', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.users_has_routes.findMany({
      where: {
        user_id: req.user.id,
        route_id: parseInt(req.body.route_id)

      }
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
app.post('/userHasRoute/create', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.users_has_routes.create({
      data: {
        user_id: req.user.id,
        route_id: parseInt(req.body.route_id),
        status_notice: parseInt(req.body.status_notice),
      }
    });
    res.send(result)
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
app.put('/route/update', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.users_has_routes.update({
      where: {
        id: parseInt(req.body.id)
      },
      data: {
        user_id: parseInt(req.user.id),
        route_id: parseInt(req.body.route_id),
        status_notice: parseInt(req.body.status_notice),
      }
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});


app.delete('/userHasRoute/delete/:id', authenticateToken, async (req, res) => {
  try {
    const isUser = await prisma.users_has_routes.findUnique(
      {
        where: {
          id: parseInt(req.params.id)
        },
        select: {
          user_id: true
        }
      }
    );
    if (isUser.user_id === req.user.id) {
      const result = await prisma.users_has_routes.delete(
        {
          where:
            { id: parseInt(req.params.id) }
        })
      res.send(result);
    } else {
      res.status(400).send('Une erreur est survenue')
    }

  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});

app.post('/create/images', authenticateToken, async (req, res) => {
  const imageData = [];
  try {
    for (let i = 0; i < 10; i++) {
      imageData.push({
        path: faker.image.avatar()
      });
    }
    const result = await prisma.images.createMany({
      data: imageData
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});

app.post('/create/messages', authenticateToken, async (req, res) => {
  const imageData = [];
  try {
    for (let i = 0; i < 10; i++) {
      imageData.push({
        sended_by_user_id: faker.datatype.number({
          'min': 1,
          'max': 3
        }),
        received_by_user_id: faker.datatype.number({
          'min': 1,
          'max': 3
        }),
        content: faker.lorem.sentences(),
        sended_at: faker.date.recent()
      });
    }
    const result = await prisma.messages.createMany({
      data: imageData
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});

app.post('/create/notices', authenticateToken, async (req, res) => {
  const imageData = [];
  try {
    for (let i = 0; i < 10; i++) {
      imageData.push({
        score: faker.datatype.number({
          'min': 1,
          'max': 5
        }),
        comment: faker.lorem.sentences(),
        user_id: faker.datatype.number({
          'min': 1,
          'max': 3
        }),
      });
    }
    const result = await prisma.notices.createMany({
      data: imageData
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});

app.post('/create/routes', authenticateToken, async (req, res) => {
  const imageData = [];
  try {
    for (let i = 0; i < 10; i++) {
      imageData.push({
        user_id: faker.datatype.number({
          'min': 1,
          'max': 3
        }),
        arrival_city_id: faker.datatype.number({
          'min': 1,
          'max': 35853
        }),
        departure_city_id: faker.datatype.number({
          'min': 1,
          'max': 35853
        }),
        departure_time: faker.date.soon(),
        arrival_time: faker.date.soon(),
        departure_date: faker.date.soon(),
        available_seats: faker.datatype.number({
          'min': 1,
          'max': 6
        }),
        remaining_seats: faker.datatype.number({
          'min': 0,
          'max': 6
        }),
        statuts: true
      });
    }
    const result = await prisma.routes.createMany({
      data: imageData
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
app.post('/create/users', authenticateToken, async (req, res) => {
  const userData = [];
  try {
    for (let i = 0; i < 10; i++) {
      userData.push({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
        password: hashPassword(faker.internet.password()),
        role_id: faker.datatype.number({
          'min': 1,
          'max': 2
        }),
        status: true
      });
    }
    const result = await prisma.users.createMany({
      data: userData
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});

app.post('/create/usersHasRoutes', authenticateToken, async (req, res) => {
  const imageData = [];
  try {
    for (let i = 0; i < 10; i++) {
      imageData.push({
        user_id: faker.datatype.number({
          'min': 1,
          'max': 1
        }),
        route_id: faker.datatype.number({
          'min': 1,
          'max': 52
        }),
        status_notice: 0,
      });
    }
    const result = await prisma.users_has_routes.createMany({
      data: imageData
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});


// *************************************
// ROUTES FOR VIEWS
// *************************************
app.get('/views/routesHistory', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT * FROM route_history WHERE user_has_route_user_id = ${req.user.id}`
    console.log(result)
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});

app.get('/views/existingRoutes', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT * FROM existing_routes WHERE user_id != ${req.user.id} AND remaining_seats!=0 AND status=1 AND (CONCAT(departure_date, ' ', ADDTIME(departure_time, '01:00:00')) > NOW())
    ORDER BY departure_date DESC , departure_time DESC`
    console.log(result)
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});

// *************************************
// ROUTES FOR Note
// *************************************


app.get('/notices/user', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT notices.score as  "note", notices.comment as "comantaire"  FROM notices WHERE user_id = ${req.user.id};
    `;
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});

app.get('/notices/user/moyen', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT notices.user_id as "user",SUM(notices.score)/COUNT(*) as "moyenne" FROM notices  WHERE user_id = ${req.user.id} GROUP BY  user_id;
    `;
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});

app.get('*', (req, res) => res.sendFile(path.resolve('dist', 'index.html')));


app.listen(port, function () {
  console.log('App listening on port: ' + port);
});

