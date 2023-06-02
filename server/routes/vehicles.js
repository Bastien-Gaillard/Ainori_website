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
    const cars = await prisma.users.findUnique({
        where: {
            id: req.user.id,
        },
        select: {
            vehicule: {
                select: {
                    id: true,
                    name: true,
                    images: {
                        select: {
                            path: true
                        }
                    },
                    models: {
                        select: {
                            mark: true,
                            model: true
                        }
                    },
                    color: true,
                    lisence_plate: true,
                    available_seats: true
                },
                where: {
                    status: 1,
                }
            }
        }
    });
    res.send(cars);
});

router.post('/create', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.users_vehicles.create({
            data: {
                user_id: req.user.id,
                name: req.body.name,
                available_seats: req.body.available_seats,
                color: req.body.color,
                lisence_plate: req.body.lisence_plate,
                model_id: req.body.models.id,
                image_id: req.body.images.id,
            }
        });
        res.send(result);
    } catch (error) {
        console.error(error);
    }
});


router.put('/update', authenticateToken, async (req, res) => {
    try {
        if (!!req.body.images) {
            const result = await prisma.users_vehicles.update({
                where: {
                    id: req.body.id
                },
                data: {
                    user_id: req.user.id,
                    name: req.body.name,
                    available_seats: req.body.available_seats,
                    color: req.body.color,
                    lisence_plate: req.body.lisence_plate,
                    image_id: req.body.images.id,

                }
            });
            res.send(result);
        } else {
            const result = await prisma.users_vehicles.update({
                where: {
                    id: req.body.id
                },
                data: {
                    user_id: req.user.id,
                    name: req.body.name,
                    available_seats: req.body.available_seats,
                    color: req.body.color,
                    lisence_plate: req.body.lisence_plate,
                }
            });
            res.send(result);
        }
    } catch (error) {
        console.error(error);
    }
});

router.post('/update/status', authenticateToken, async (req, res) => {
    const result = await prisma.users_vehicles.update({
        where: {
            id: parseInt(req.body.id)
        },
        data: {
            status: req.body.status,
        },
    });
    res.send(result);
});



router.post('/id', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.users_vehicles.findUnique({
            where: {
                id: parseInt(req.body.id)
            }
        });
        res.send(result);
    } catch (error) {
        res.status(400).send('Une erreur est survenue')
    }
});

module.exports = router;

