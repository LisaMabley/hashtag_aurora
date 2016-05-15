var app = angular.module('auroraApp', []);

app.controller("IndexController", ['$http', function($http) {
  var controller = this;
  controller.twitterStuff = [];

  $http.get('/tweets').then(function(response) {
    controller.twitterStuff = response.data;
  })
}]);
