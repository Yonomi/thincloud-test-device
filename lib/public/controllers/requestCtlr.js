angular
  .module('com.yonomi.testdevice.requestCtlr', [])
  .controller('requestCtlr', [
    '$scope',
    '$http',
    function (vm, $http) {
      vm.requestUrl = null;
      vm.requestPayload = null;
      vm.responseBody = null;

      // vm.isEnabled = false

      vm.sendRequest = () => {
        $http.post('/device/requests', {
          method: vm.requestUrl,
          data: vm.requestPayload
        }).then(data => {
          vm.responsePayload = data.data;
        });
      };

    }]);
