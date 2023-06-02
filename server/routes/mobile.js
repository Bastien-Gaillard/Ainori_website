const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
const cryptoJs = require('crypto-js');

function hashPassword(password) {
    return (cryptoJs.SHA256(password).toString());
}

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

router.post('/login', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
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
    res.send(user);

});

router.post('/routesComming', authenticateToken, async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    try {
        const result = await prisma.$queryRaw`
      SELECT * FROM route_history WHERE status = 1 AND user_has_route_user_id = ${req.body.id} OR driver_id = ${req.body.id}
      ORDER BY departure_date DESC, departure_time DESC`;
        res.send(result);
    } catch (error) {
        res.status(400).send('Une erreur est survenue')
    }
});
router.delete('userHasRoute/delete/:id',authenticateToken,  async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    try {
        const isUser = await prisma.users_has_routes.deleteMany(
            {
                where: {
                    id: parseInt(req.params.id)
                },
            }
        );

        res.send(isUser);
    } catch (error) {
        res.status(400).send('Une erreur est survenue')
    }
});


router.post('/routeInfo',authenticateToken,  async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    try {
        const result = await prisma.$queryRaw`
      SELECT * FROM good_routes WHERE route_id = ${req.body.route_id}`;
        res.send(result);
    } catch (error) {
        res.status(400).send('Une erreur est survenue')
    }
});

router.post('usersHasRoutes/route', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.users_has_routes.findMany({
            where: {
                route_id: parseInt(req.body.route_id)
            }
        });
        res.send(result);
    } catch (error) {
        res.status(400).send('Une erreur est survenue')
    }
});

router.delete('route/delete/:id', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.routes.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        res.send(result);
    } catch (error) {
        res.status(400).send('Une erreur est survenue')
    }
});

router.post('/propRoutes', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.$queryRaw`
        SELECT *
        FROM good_routes e
        WHERE e.remaining_seats != 0 
            AND e.status = 1 
            AND (CONCAT(e.departure_date, ' ', ADDTIME(e.departure_time, '01:00:00')) > NOW())
            AND e.route_id NOT IN (
                SELECT route_id
                FROM users_has_routes
                WHERE user_id = ${req.body.id}
        )
        ORDER BY e.departure_date DESC, e.departure_time DESC;
        `
        res.send(result);
    } catch (error) {
        res.status(400).send('Une erreur est survenue')
    }
});

router.post('/routesHistory', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.$queryRaw`
      SELECT * FROM route_history 
      WHERE driver_id = ${req.body.id} OR user_has_route_user_id = ${req.body.id} AND status = 0
      ORDER BY departure_date DESC, departure_time DESC`
        res.send(result);
    } catch (error) {
        res.status(400).send('Une erreur est survenue')
    }
});

module.exports = router;