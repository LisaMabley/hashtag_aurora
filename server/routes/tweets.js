var express = require('express');
var path = require('path');
var tweetGetter = require('../../modules/twitter');

var router = express.Router();

// Endpoints
router.get('/', function(request, response) {
  response.send(tweetGetter('climate'));
});

// Export
module.exports = router;
