const express = require('express');
const bodyParser  = require("body-parser");
const path = require('path');
const app = express();


//Getting our Posts routes
const routes = require('./server/routes');
const auth = require('./server/auth');

//using middleware
app.use(express.static(path.join(__dirname, 'dist/ang-node')));
app.use('/uploads', express.static(process.cwd() + '/uploads'));
app.use(bodyParser.json());
app.use('/routes', routes);
app.use('/users', routes);
app.use('/auth', auth);

//Catch all other routes request and return it to the index with *
app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname,'dist/ang-node/index.html'))
});

//constant PORT that takes the number from environment variables or default number
const PORT = process.env.PORT || 4600;

app.listen(PORT, (req, res)=>{
    console.log('running');
});