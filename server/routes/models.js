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


router.post('/model', authenticateToken, async (req, res) => {
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
router.get('/marks', async (req, res) => {
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

router.post('/models', async (req, res) => {
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

module.exports = router;
