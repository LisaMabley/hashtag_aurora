var app = angular.module('auroraApp', []);

app.controller("IndexController", ['$http', function($http) {
  console.log('LOADING CONTROLLER');
  var controller = this;
  controller.start = function() {
    console.log('START FUNCTION IN CONTROLLER');
    $http.get('/').then(function(response) {
      console.log(response.data);
    })
  }

  controller.start();
}]);
