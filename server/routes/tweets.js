var express = require('express');
var path = require('path');
var OAuth2 = require('oauth').OAuth2;
var bodyParser = require('body-parser');
var router = express.Router();
var Twitter = require('../public/vendor/twitter');
var base64 = require('../public/vendor/base64');

// var client = new Twitter({
//   consumer_key: key,
//   consumer_secret: secret,
//   bearer_token: token
// });

function getBearerToken() {
  // var encodedString = base64.encode(key + ':' + secret);
  // var authRequest = new XMLHttpRequest();
  // authRequest.open("POST", "https://api.twitter.com/oauth2/token");
  // authRequest.setRequestHeader("Authorization", "Basic " + encodedString);
  // authRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
  // authRequest.onreadystatechange = function () {
      // if (authRequest.readyState == 4) {
      //     var accessToken = JSON.parse(authRequest.response);
      //     console.log("access token:", accessToken);
      // }
    // }
    // authRequest.send("grant_type=client_credentials");
  }

var input = 'climate';
var hashtag = '#' + input;

// Endpoints
router.get('/', function(request, response) {
  console.log('GETTING TWEETS');
  response.send('Hi!');
  // Get tweets containing the hashtag

  // client.get('search/tweets', {q: hashtag}, function(error, tweets, response){
  //   console.log(tweets);
  // });
});

// Export
module.exports = router;
