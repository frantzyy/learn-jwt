var express = require('express');
var faker = require('faker');
var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');


//USERS
var user = {
    username: 'chris',
    password: 'surf'
}

//SECURITY
var jwtSecret = 'happy';


//SERVER
var app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/random-user', function(req, res) {
    var user = faker.helpers.userCard();
    user.avatar = faker.image.avatar();
    res.json(user);

});

app.post('/login', authenticate, function(req, res) {
    var token = jwt.sign({
            username: user.username
        },
        jwtSecret);

    res.send({
        token: token,
        user: user
    });
});

app.listen(3000, function() {
    console.log('app listening on localhost:3000');
});

//UTIL FUNCTIONS

function authenticate(req, res, next) {
    var body = req.body;
    if (!body.username || !body.password) {
        res.status(400).end('Must provide a username or password');
    }

    if (body.username !== user.username || body.password !== user.password) {
        res.status(401).end('Username or password incorrect');
    }
    next();

}
