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

app.post('/images', authenticateToken, async (req, res) => {
    const imageData = [];
    try {
        for (let i = 0; i < 10; i++) {
            imageData.push({
                path: faker.image.avatar()
            });
        }
        const result = await prisma.images.createMany({
            data: imageData
        });
        res.send(result);
    } catch (error) {
        res.status(400).send('Une erreur est survenue')
    }
});

app.post('/messages', authenticateToken, async (req, res) => {
    const imageData = [];
    try {
        for (let i = 0; i < 10; i++) {
            imageData.push({
                sended_by_user_id: faker.datatype.number({
                    'min': 1,
                    'max': 3
                }),
                received_by_user_id: faker.datatype.number({
                    'min': 1,
                    'max': 3
                }),
                content: faker.lorem.sentences(),
                sended_at: faker.date.recent()
            });
        }
        const result = await prisma.messages.createMany({
            data: imageData
        });
        res.send(result);
    } catch (error) {
        res.status(400).send('Une erreur est survenue')
    }
});

app.post('/notices', authenticateToken, async (req, res) => {
    const imageData = [];
    try {
        for (let i = 0; i < 10; i++) {
            imageData.push({
                score: faker.datatype.number({
                    'min': 1,
                    'max': 5
                }),
                comment: faker.lorem.sentences(),
                user_id: faker.datatype.number({
                    'min': 1,
                    'max': 3
                }),
            });
        }
        const result = await prisma.notices.createMany({
            data: imageData
        });
        res.send(result);
    } catch (error) {
        res.status(400).send('Une erreur est survenue')
    }
});

app.post('/routes', authenticateToken, async (req, res) => {
    const imageData = [];
    try {
        for (let i = 0; i < 10; i++) {
            imageData.push({
                user_id: faker.datatype.number({
                    'min': 1,
                    'max': 3
                }),
                arrival_city_id: faker.datatype.number({
                    'min': 1,
                    'max': 35853
                }),
                departure_city_id: faker.datatype.number({
                    'min': 1,
                    'max': 35853
                }),
                departure_time: faker.date.soon(),
                arrival_time: faker.date.soon(),
                departure_date: faker.date.soon(),
                available_seats: faker.datatype.number({
                    'min': 1,
                    'max': 6
                }),
                remaining_seats: faker.datatype.number({
                    'min': 0,
                    'max': 6
                }),
                statuts: true
            });
        }
        const result = await prisma.routes.createMany({
            data: imageData
        });
        res.send(result);
    } catch (error) {
        res.status(400).send('Une erreur est survenue')
    }
});
app.post('/users', authenticateToken, async (req, res) => {
    const userData = [];
    try {
        for (let i = 0; i < 10; i++) {
            userData.push({
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName(),
                email: faker.internet.email(),
                password: hashPassword(faker.internet.password()),
                role_id: faker.datatype.number({
                    'min': 1,
                    'max': 2
                }),
                status: true
            });
        }
        const result = await prisma.users.createMany({
            data: userData
        });
        res.send(result);
    } catch (error) {
        res.status(400).send('Une erreur est survenue')
    }
});

app.post('/usersHasRoutes', authenticateToken, async (req, res) => {
    const imageData = [];
    try {
        for (let i = 0; i < 10; i++) {
            imageData.push({
                user_id: faker.datatype.number({
                    'min': 1,
                    'max': 1
                }),
                route_id: faker.datatype.number({
                    'min': 1,
                    'max': 52
                }),
                status_notice: 0,
            });
        }
        const result = await prisma.users_has_routes.createMany({
            data: imageData
        });
        res.send(result);
    } catch (error) {
        res.status(400).send('Une erreur est survenue')
    }
});

module.exports = router;
