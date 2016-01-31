var express = require('express');
var faker = require('faker');

var app = express();

app.get('/random-user', function(req, res) {
var user = faker.helpers.userCard();
user.avatar = faker.image.avatar();

res.json(user);

});

app.listen(3000, function(){
console.log('app listening on localhost:3000');
});
