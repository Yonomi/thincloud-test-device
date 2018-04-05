angular
  .module('com.yonomi.testdevice.storageCtlr', [])
  .controller('storageCtlr', [
    '$scope',
    '$http',
    function (vm, $http) {
      vm.storageItems = null;

      let load = () => {
        $http.post("/device/requests", {
          method: 'get /storage/test',
          body: "{}"
        }).then(response => {
          vm.storageItems = response.data.result.body;
        })
      };

      load();


    }]);
