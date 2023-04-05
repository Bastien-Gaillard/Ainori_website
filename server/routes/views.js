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

router.get('/myRoutes', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.$queryRaw`
      SELECT * FROM route_history 
      WHERE user_id = ${req.user.id} 
      AND status = 0 
      AND (CONCAT(departure_date, ' ', ADDTIME(arrival_time, '01:00:00')) < NOW())
      OR driver_id = ${req.user.id} AND status = 0 AND (CONCAT(departure_date, ' ', ADDTIME(arrival_time, '01:00:00')) < NOW())
      ORDER BY departure_date DESC, departure_time DESC`
        console.log(result)
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue')
    }
});

router.get('/routesHistoryDriver', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.$queryRaw`
      SELECT * FROM route_history 
      WHERE driver_id = ${req.user.id} AND status = 0
      ORDER BY departure_date DESC, departure_time DESC`
        console.log(result)
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue')
    }
});

router.get('/routesHistoryUser', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.$queryRaw`
      SELECT * FROM route_history 
      WHERE user_has_route_user_id = ${req.user.id} AND status = 0
      ORDER BY departure_date DESC, departure_time DESC`
        console.log(result)
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue')
    }
});

router.get('/routesComming', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.$queryRaw`
      SELECT * FROM route_history WHERE user_has_route_user_id = ${req.user.id}
      AND status = 1 
      OR driver_id = ${req.user.id} AND status = 1
      ORDER BY departure_date DESC, departure_time DESC`;
        console.log(result)
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue')
    }
});

router.get('/existingRoutes', authenticateToken, async (req, res) => {
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

module.exports = router;
