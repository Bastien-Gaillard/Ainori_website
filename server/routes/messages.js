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

router.post('/create', authenticateToken, async (req, res) => {
    try {
        const result = await prisma.messages.create({
            data: {
                sended_by_user_id: req.user.id,
                received_by_user_id: req.body.received_by_user_id,
                content: req.body.content,
                sended_at: new Date()
            }
        });
        console.log(result)
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send('Une erreur est survenue')
    }
});


module.exports = router;