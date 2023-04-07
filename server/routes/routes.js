const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

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


router.get('/routes', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.routes.findMany();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
router.get('/routes/id', authenticateToken, async (req, res) => {
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
router.post('', authenticateToken, async (req, res) => {
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

router.post('/departure/arrival', authenticateToken, async (req, res) => {
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
router.post('/create', authenticateToken, async (req, res) => {
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
router.put('/update', authenticateToken, async (req, res) => {
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


router.put('/remainingSeats', authenticateToken, async (req, res) => {
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
router.put('/disable', authenticateToken, async (req, res) => {
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
router.put('/enable', authenticateToken, async (req, res) => {
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

router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    console.log('req.params', req.params)
    const result = await prisma.routes.delete({
      where: {
        id: parseInt(req.params.id)
      }
    });
    console.log('the result is', result)
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});

module.exports = router;
