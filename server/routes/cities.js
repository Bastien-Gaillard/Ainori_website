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

router.get('/get/cities/name', async (req, res) => {
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

router.post('', authenticateToken, async (req, res) => {
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
router.post('/id', authenticateToken, async (req, res) => {
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
router.post('/zip_code/name', authenticateToken, async (req, res) => {
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
router.post('/cities', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.cities.findMany();
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue')
    }
});
router.post('/create', authenticateToken, async (req, res) => {
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
router.put('/update', authenticateToken, async (req, res) => {
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
router.delete('/delete', authenticateToken, async (req, res) => {
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

module.exports = router;