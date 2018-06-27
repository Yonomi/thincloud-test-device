angular.module('com.yonomi.testdevice.relatedDevicesCtlr', []).controller('relatedDevicesCtlr', [
  '$scope',
  '$http',
  function (vm, $http) {

    vm.relatedDevices = [];

    vm.isLoading = false;
    vm.isError = false;
    vm.isSuccess = false;

    vm.relatedDevicesMap = {};

    vm.addRelatedDevice = () => {
      let _relatedDevice = {
        deviceType: vm.deviceType,
        physicalId: vm.physicalId,
        deviceId: vm.deviceId
      };

      vm.isLoading = true;
      $http
        .post('/device/relatedDevices', _relatedDevice)
        .then(response => {
          vm.isSuccess = true;
          vm.isLoading = false;
          vm.syncRelatedDevices();
        }, () => {
          vm.isError = true;
          vm.isSuccess = false;
          vm.isLoading = false;
        });
    };

    vm.removeRelatedDevice = (relatedDevice) => {
      return $http.delete(
        `/devices/relatedDevices/${relatedDevice.deviceId}?deviceType=${relatedDevice.deviceType}&physicalId=${relatedDevice.physicalId}`)
        .then(data => {
          return vm.syncRelatedDevices();
        });
    };

    vm.syncRelatedDevices = () => {
      return $http.get('devices/relatedDevices')
        .then(response => {
          vm.relatedDevices = response.data;
        });
    };

    vm.syncRelatedDevices();

  }
]);
