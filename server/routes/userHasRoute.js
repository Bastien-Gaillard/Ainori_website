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

router.get('/usersHasRoutes', authenticateToken, async (req, res) => {
  try {
    const result = await prisma.users_has_routes.findMany();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
router.post('', authenticateToken, async (req, res) => {
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
router.post('/route', authenticateToken, async (req, res) => {
  try {
    console.log(req.body);
    const result = await prisma.users_has_routes.findMany({
      where: {
        route_id: parseInt(req.body.route_id)
      }
    });
    console.log(result)
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Une erreur est survenue')
  }
});
router.post('/user', authenticateToken, async (req, res) => {
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
router.post('/user/route', authenticateToken, async (req, res) => {
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
router.post('/create', authenticateToken, async (req, res) => {
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
router.put('/update', authenticateToken, async (req, res) => {
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


router.delete('/userHasRoute/delete/:id', authenticateToken, async (req, res) => {
  try {
    const isUser = await prisma.users_has_routes.deleteMany(
      {
        where: {
          route_id: parseInt(req.params.id)
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

module.exports = router;
