angular.module('com.yonomi.testdevice.commissionCtlr', []).controller('commissionCtlr', [
  '$scope',
  '$http',
  '$location',
  function (vm, $http, $location) {
    vm.port = 8883;
    vm.host = null;
    vm.region = null;

    vm.commission = (host, port, region) => {
      vm.isLoading = true;
      $http
        .post('/device/commission', {
          port: vm.port,
          host: vm.host,
          region: vm.region
        })
        .then(response => {
          vm.isLoading = false;
          $location.path('main');
          console.log(response);
        });
    };

    let loadConfig = () => {
      $http
        .get('device/config')
        .then(config => {
          vm.port = config.data.port || null;
          vm.host = config.data.host || null;
          vm.region = config.data.region || null;
        });
    };

    loadConfig();

    vm.disableCommission = () => {
      return vm.port != null || vm.host != null || vm.region != null;
    };
  }
]);
