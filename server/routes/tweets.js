var express = require('express');
var path = require('path');
var OAuth2 = require('oauth').OAuth2;
var bodyParser = require('body-parser');
var router = express.Router();
var Twitter = require('twitter');
var base64 = require('base-64');
var request = require('request');

var key = '3lW3QYg9Z8Tyltok8uuYkv01e';
var secret = '9mS6NKMqa1dtKe8NnAQsRbYtC7WCUDL9OHimr3mSXUSojM6rj0';
// var token = getBearerToken();
var token = 'AAAAAAAAAAAAAAAAAAAAALO0vAAAAAAAw5MjA7weaSHVKADP0bMn52mvOKc%3Dc0Migs9DC2VnDI5R3koIyzXRmKUzyDXdQxgKpw6Qd2BPYHLBct';

var client = new Twitter({
  consumer_key: key,
  consumer_secret: secret,
  bearer_token: token
});

// function getBearerToken() {
//   var encodedString = base64.encode(key + ':' + secret);
//
//   request({
//       url: 'https://api.twitter.com/oauth2/token',
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
//         'Authorization': 'Basic ' + encodedString
//       },
//       body: 'grant_type=client_credentials'
//   }, function(error, response, body){
//       if(error) {
//           console.log(error);
//       } else {
//           var token = JSON.parse(body).access_token;
//           console.log(token);
//           return token;
//       }
//   });
// };

var input = 'climate';
var hashtag = '#' + input;

// Endpoints
router.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/index.html'));

  // Get tweets containing the hashtag
  client.get('search/tweets', {q: hashtag}, function(error, tweets, response){
    if(error) {
      console.log(error);
    };
      console.log(tweets);
  });
});

// Export
module.exports = router;
