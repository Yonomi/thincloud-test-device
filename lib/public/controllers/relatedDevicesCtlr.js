angular.module('com.yonomi.testdevice.relatedDevicesCtlr', []).controller('relatedDevicesCtlr', [
  '$scope',
  '$http',
  function (vm, $http) {
    vm.addRelatedDevice = () => {
      console.log(vm.devicetypeId, vm.physicalId, vm.deviceId);
      $http
        .post('/device/relatedDevices', {
          devicetypeId: vm.devicetypeId,
          physicalId: vm.physicalId,
          deviceId: vm.deviceId
        })
        .then(data => {
          vm.responsePayload = data.data;
        });
    };

  }
]);
