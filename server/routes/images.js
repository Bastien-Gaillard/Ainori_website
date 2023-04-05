const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

const storageVehicles = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/vehicles");
    },
    filename: function (req, file, cb, res) {
        const splitFile = file.originalname.split('.');
        const newName = uuidv4();
        cb(null, newName + '.' + splitFile[1]);
    },
});
const uploadVehicles = multer({ storage: storageVehicles });

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

router.post("/upload", uploadVehicles.single("image"), (req, res) => {
    res.send(req.file.path.split('\\')[3])
});

router.post('/create', authenticateToken, async (req, res) => {
    try {
        if (!!req.body.image) {
            const result = await prisma.images.create({
                data: {
                    path: req.body.path + req.body.image
                }
            });
            res.send(result);
        }
    } catch (error) {
        console.error(error);
    }

});

module.exports = router;
