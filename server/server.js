// VARIABLES
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Import routers
var router = require('./routes/index');
var tweetRouter = require('./routes/tweets');

// APP CONFIG
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.static('server/public'));

// Config: router
app.use('/', router);
app.use('/tweets', tweetRouter);

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
    console.log('Server running on port ' + port);
});
