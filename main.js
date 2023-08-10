const express = require('express');
const createDatabase = require('./database');

const app = express();
app.use(express.json());

const database = createDatabase();

app.get('/foo', async (req, res) => {
    const user = await database.getUserNameAndPass("Tom", "123abc");
    return res.send({user});
})


app.listen('5000', () => {
    console.log('Server Started on port 5000');
})
