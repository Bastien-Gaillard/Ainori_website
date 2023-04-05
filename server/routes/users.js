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

router.get('/current/session', authenticateToken, (req, res) => {
    delete req.user.password;
    res.send(req.user);
});

router.get('/current/id', authenticateToken, async (req, res) => {
    const user = await prisma.users.findUnique({
        where: {
            id: req.user.id,
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
    res.send(user);
});
router.get('/users', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.users.findMany();
        delete result.password;
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue');
    }
});
//Check if user already connect or not
router.get('/check', (req, res) => {
    res.set('Content-Type', 'application/json');
    if (req.session.user_id) {

        res.send(true);
    } else {
        res.send(false);
    }
});
router.post('/id', authenticateToken, async (req, res) => {
    const user = await prisma.users.findUnique({
        where: {
            id: parseInt(req.body.id),
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
    res.send(user);
});
router.post('/create', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.users.create({
            data: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hashPassword(req.body.email),
                status: req.body.status === 'true' ? true : false,
                role_id: req.body.role === 'user' ? 1 : 2
            }
        });
        res.send(result);
    } catch (error) {
        console.log(error)
    }
});
router.put('/update', authenticateToken, async (req, res) => {
    const result = await prisma.users.update({
        where: {
            id: parseInt(req.body.id)
        },
        data: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            description: req.body.description
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
    req.user = result;
    res.send(result);
});
router.put('/update/password', authenticateToken, async (req, res) => {
    const result = await prisma.users.update({
        where: {
            id: parseInt(req.body.id)
        },
        data: {
            password: hashPassword(req.body.password),
        }
    });
    res.send(result);
});

router.put('/disable', authenticateToken, async (req, res) => {
    console.log(req);

    try {
        const result = await prisma.users.update({
            where: {
                id: parseInt(req.body.id)
            },
            data: {
                status: false,
            },
        });
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue')
    }
});
router.put('/enable', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.users.update({
            where: {
                id: parseInt(req.body.id)
            },
            data: {
                status: true,
            },
        });
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue')
    }
});
// delete user by id
router.delete('/delete', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.users.delete({
            where: {
                id: parseInt(req.body.id)
            }
        });
        res.send(result)
    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue');
    }
});

module.exports = router;
