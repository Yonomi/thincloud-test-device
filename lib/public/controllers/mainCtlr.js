angular
  .module('com.yonomi.testdevice.main', [])
  .controller('mainCtlr',
    [
      '$scope',
      '$location',
      '$http',
      function (vm, $location, $http) {
        $http.get("/v1/device")
          .then(function(response) {
            console.log(response);
          });
      }
    ]);
