const { PrismaClient } = require('@prisma/client');

const express = require('express');
const path = require('path'); // NEW
const prisma = new PrismaClient()

const app = express();
const port = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, '../dist'); // NEW
const HTML_FILE = path.join(DIST_DIR, 'index.html'); // NEW
const mockResponse = {
  foo: 'bar',
  bar: 'foo'
};
app.use(express.static(DIST_DIR)); // NEW
app.get('/api', (req, res) => {
  res.send(mockResponse);
});
app.get('/', (req, res) => {
  res.sendFile(HTML_FILE); // EDIT
});

app.listen(port, function () {
  console.log('App listening on port: ' + port);
});

app.get('/api/get/users/', async (req, res) => {
  const users = await prisma.users.findMany()
  res.send(users);
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



