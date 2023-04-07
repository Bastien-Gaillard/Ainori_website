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

router.get('/routesCommingDriver', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.$queryRaw`
      SELECT * FROM route_history WHERE user_id = ${req.user.id} AND status = 1
      ORDER BY departure_date DESC, departure_time DESC`;
        console.log(result)
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue')
    }
});

router.get('/routesCommingUser', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.$queryRaw`
      SELECT * FROM route_history WHERE user_has_route_user_id = ${req.user.id} AND status = 1
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

router.get('/conversations', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.$queryRaw`
        SELECT subquery.user_id, subquery.name
        FROM (
            SELECT received_by_user_id as user_id, receiver as name
            FROM display_messages AS dm
            WHERE dm.sended_by_user_id = ${req.user.id}
            GROUP BY dm.received_by_user_id, receiver
            UNION
            SELECT sended_by_user_id as user_id, sender as name
            FROM display_messages AS dm
            WHERE dm.received_by_user_id = ${req.user.id}
            GROUP BY dm.sended_by_user_id, sender
        ) as subquery
        GROUP BY subquery.user_id;`
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
        console.log(result);

        const receive = await prisma.users.findUnique({
            where: {
                id: req.body.user_id
            },
            select: {
                firstname: true
            }
        })
        result.forEach(element => {
            if(element.sended_by_user_id == req.user.id){
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


module.exports = router;
