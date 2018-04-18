angular.module('com.yonomi.testdevice.main', []).controller('mainCtlr', [
  '$scope',
  '$location',
  '$http',
  function (vm, $location, $http) {
    vm.currentTab = 'requests';
    vm.setTab = tab => {
      vm.currentTab = tab;
    };

    vm.updateState = state => {
      $http.put('/device/state', state).then(function (response) {
        vm.device = response.data;
      });
    };

    $http.get('/device').then(function (response) {
      vm.device = response.data;
    });
  }
]);
