angular.module('com.yonomi.testdevice.relatedDevicesCtlr', []).controller('relatedDevicesCtlr', [
  '$scope',
  '$http',
  function (vm, $http) {

  vm.device = null;

  vm.isLoading = false;
  vm.isError = false;
  vm.isSuccess = false;

    vm.addRelatedDevice = () => {
      vm.isLoading = true;
      console.log(vm.devicetypeId, vm.physicalId, vm.deviceId);
      $http
        .post('/device/relatedDevices', {
          deviceType: vm.devicetypeId,
          physicalId: vm.physicalId,
          deviceId: vm.deviceId
        })
        .then(data => {
          vm.isSuccess = true;
          vm.isLoading = false;
          vm.responsePayload = data.data;
          // refreshDevice();
        }, err => {
          console.log(err);
          vm.isError = true;
          vm.isSuccess = false;
          vm.isLoading = false;
          // refreshDevice();
        });
    };

    // let refreshDevice = () => {
    //   $http
    //     .post('/device/requests', {
    //       method: 'get',
    //       data: '{}'
    //     })
    //     .then(response => {
    //       vm.device = response.data.result.body;
    //     });
    // };
    //
    // refreshDevice();

    let removeRelatedDevice = () => {

    };

  }
]);
