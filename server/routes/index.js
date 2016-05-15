var express = require('express');
var path = require('path');

var router = express.Router();

// Endpoints
router.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/index.html'));
});

// Export
module.exports = router;
