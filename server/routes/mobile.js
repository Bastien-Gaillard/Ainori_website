const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
const cryptoJs = require('crypto-js');

function hashPassword(password) {
    return (cryptoJs.SHA256(password).toString());
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
        console.log('null');
        res.send("null");
        return;
    } else if (user?.status == 0) {
        console.log('disable');

        res.send("disable");
        return;
    } else if (hashPassword(req.body.password) != user.password) {
        console.log('oops');
        res.send("null");
        return;
    }
    delete user.password;
    //Create token and add user_id and token in the session
    delete user.password;
    console.log(user);
    res.send(user);

});

router.get('/routesCommingDriver', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    try {
        const result = await prisma.$queryRaw`
      SELECT * FROM good_routes WHERE user_id = 1 AND status = 1
      ORDER BY departure_date DESC, departure_time DESC`;
        console.log(result)
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue')
    }
});


router.get('/routesCommingUser', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    try {
        const result = await prisma.$queryRaw`
      SELECT * FROM route_history WHERE user_has_route_user_id = 1 AND status = 1
      ORDER BY departure_date DESC, departure_time DESC`;
        console.log(result)
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue')
    }
});

router.delete('userHasRoute/delete/:id', async (req, res) => {

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
        console.log(error);
        res.status(400).send('Une erreur est survenue')
    }
});


router.post('/routeInfo', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

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

router.post('usersHasRoutes/route', async (req, res) => {
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

router.delete('route/delete/:id', async (req, res) => {
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