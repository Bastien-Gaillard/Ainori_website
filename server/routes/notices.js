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


router.get('/user', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.$queryRaw`
        SELECT notices.score as  "note", notices.comment as "comantaire"  FROM notices WHERE user_id = ${req.user.id};
      `;
        res.send(result);
    } catch (error) {
        res.status(400).send('Une erreur est survenue')
    }
});

router.get('/user/moyen', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.$queryRaw`
        SELECT notices.user_id as "user",SUM(notices.score)/COUNT(*) as "moyenne" FROM notices  WHERE user_id = ${req.user.id} GROUP BY  user_id;
      `;
        res.send(result);
    } catch (error) {
        res.status(400).send('Une erreur est survenue')
    }
});

module.exports = router;
