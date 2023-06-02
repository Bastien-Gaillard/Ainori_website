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

router.get('/routesHistoryDriver', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.$queryRaw`
      SELECT * FROM route_history 
      WHERE driver_id = ${req.user.id} AND status = 0
      ORDER BY departure_date DESC, departure_time DESC`
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue')
    }
});

router.get('/routesHistory', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.$queryRaw`
      SELECT * FROM route_history 
      WHERE status = 0 AND user_id = ${req.user.id} OR driver_id = ${req.user.id}
      ORDER BY departure_date DESC, departure_time DESC`
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue')
    }
});

router.get('/routesComming', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.$queryRaw`
      SELECT * FROM good_routes WHERE status = 1
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

router.post('/conversation', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.$queryRaw`
       SELECT content, sended_at, sended_by_user_id 
       FROM messages 
       WHERE (sended_by_user_id = ${req.user.id} AND received_by_user_id = ${req.body.user_id}) 
       OR (sended_by_user_id = ${req.body.user_id} AND received_by_user_id = ${req.user.id}) 
       ORDER BY sended_at ASC;`

        const receive = await prisma.users.findUnique({
            where: {
                id: req.body.user_id
            },
            select: {
                firstname: true
            }
        })
        result.forEach(element => {
            if (element.sended_by_user_id == req.user.id) {
                element.position = 'right';
                element.background_color = '#00bcd4';
                element.name = 'Vous';
                delete element.sended_by_user_id
            } else {
                element.position = 'left';
                element.background_color = '#ffc107';
                element.name = receive.firstname;
                delete element.sended_by_user_id;
            }
        });

        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue')
    }
});

router.post('/routeInfo', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.$queryRaw`
      SELECT * FROM good_routes WHERE route_id = ${req.body.route_id}`;
        console.log(result)
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue')
    }
});
router.post('/propRoutesFilter', authenticateToken, async (req, res) => {

    try {
        const result = await prisma.$queryRaw`

            SELECT gr.* 
            FROM good_routes gr 
            WHERE gr.departure_city_code IN ( 
                SELECT v2.zip_code 
                FROM cities AS v1 
                JOIN cities AS v2 
                ON v1.zip_code = ${req.body.code}  
                AND v1.name = ${req.body.city}  
                AND (3959 * ACOS(COS(RADIANS(v1.gps_lat)) * COS(RADIANS(v2.gps_lat)) * COS(RADIANS(v2.gps_lng) - RADIANS(v1.gps_lng)) + SIN(RADIANS(v1.gps_lat)) * SIN(RADIANS(v2.gps_lat)))) <= 10 
            ) 
            AND gr.user_id != ${req.user.id} 
            AND gr.remaining_seats != 0 
            AND gr.status = 1 
            AND CONCAT(gr.departure_date, ' ', ADDTIME(gr.departure_time, '01:00:00')) > NOW() 
            AND gr.route_id NOT IN ( 
                SELECT route_id FROM users_has_routes WHERE user_id = ${req.user.id} 
            ) 
            ORDER BY gr.departure_date DESC, gr.departure_time DESC;
        `
        res.send(result);

    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue')
    }
});

router.get('/propRoutes', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.$queryRaw`
        SELECT *
        FROM good_routes e
        WHERE e.user_id != ${req.user.id} 
            AND e.remaining_seats != 0 
            AND e.status = 1 
            AND (CONCAT(e.departure_date, ' ', ADDTIME(e.departure_time, '01:00:00')) > NOW())
            AND e.route_id NOT IN (
                SELECT route_id
                FROM users_has_routes
                WHERE user_id = ${req.user.id}
        )
        ORDER BY e.departure_date DESC, e.departure_time DESC;
        `
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue')
    }
});

router.get('/allRoutes', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.$queryRaw`
        SELECT *
        FROM good_routes e
        WHERE e.remaining_seats != 0 
            AND e.status = 1 
            AND (CONCAT(e.departure_date, ' ', ADDTIME(e.departure_time, '01:00:00')) > NOW())
        ORDER BY e.departure_date DESC, e.departure_time DESC;
        `
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue')
    }
});

router.post('/allUserRout', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.$queryRaw`
        SELECT user_has_route_user_id,participant,driver_id ,user_has_route_id
        FROM route_history
        WHERE route_id = ${req.body.idRoute} ;
        `
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue')
    }
});

router.get('/allHistory', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.$queryRaw`
        SELECT *
        FROM good_routes e
        WHERE (CONCAT(e.departure_date, ' ', ADDTIME(e.departure_time, '01:00:00')) > NOW())
        ORDER BY e.departure_date DESC, e.departure_time DESC;
        `
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue')
    }
});

module.exports = router;
