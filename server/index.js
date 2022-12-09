const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');
const mockResponse = {
    foo: 'bar',
    bar: 'foo'
};

app.use('/', express.static('public', { etag: false }));
app.use('/', express.static('dist', { etag: false }));
app.get('/api', (req, res) => {
    res.send(mockResponse);
});


// GET DATA 
app.get('/api/get/userByEmail/:email', async (req, res) => {
    const result = await prisma.users.findMany({
        where: {
            email: req.params.email 
        },
    })
    res.send(result);
});

// for get user for login
app.get('/api/get/loginUserSecure/:email/:password', async (req, res) => {
  const users_login = await prisma.users.findMany(
    {
      select: {
        id: true,
        firstname: true,
        lastname:true,
        email:true,
        status:true,
        description:true,
        role : true ,
        image :true ,
      },
      where: {
        email: req.params.email,
        password: req.params.password,
        status: true,
      },
    }
  )
  res.send(users_login);
});

// UPDATE DATA
app.get('/api/update/password/:id/:password', async (req, res) => {
    const result = await prisma.users.update({
        where: { 
            id: 1 
        },
        data: { password: req.params.password },
    })
    res.send(result);
});

app.get('*', (req, res) => res.sendFile(path.resolve('dist', 'index.html')));

app.listen(port, function () {
    console.log('App listening on port: ' + port);
});








