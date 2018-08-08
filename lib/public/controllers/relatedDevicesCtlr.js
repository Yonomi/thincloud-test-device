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
        deviceId: vm.deviceId,
      };

      if (vm.custom) {
        _relatedDevice.custom = vm.custom;
      }

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
        }).finally(() => { vm.isLoading = false; });
    };

    vm.removeRelatedDevice = (relatedDevice) => {
      relatedDevice._isLoading = true;
      return $http.delete(
        `/devices/relatedDevices/${relatedDevice.deviceId}?deviceType=${relatedDevice.deviceType}&physicalId=${relatedDevice.physicalId}`)
        .then(data => {
          return vm.syncRelatedDevices();
        }).finally(() => { relatedDevice._isLoading = false; });
    };

    vm.syncRelatedDevice = (relatedDevice) => {
      relatedDevice._isLoading = true;
      return $http.get(`devices/relatedDevices/${relatedDevice.deviceId}`)
        .then(response => {
          relatedDevice = response.data;
        }).finally(() => { relatedDevice._isLoading = false; });
    };

    vm.syncRelatedDevices = () => {
      return $http.get('devices/relatedDevices')
        .then(response => {
          vm.relatedDevices = response.data;
          vm.relatedDevices = vm.relatedDevices.map((device) => {
            device._isLoading = false;
            return device;
          });
        });
    };

    vm.syncRelatedDevices();

    vm.deepSyncRelatedDevices = () => {
      vm.relatedDevices = vm.relatedDevices.map((device) => {
        device._isLoading = true;
        return device;
      });
      return $http.get('/devices/relatedDevices?sync=true')
        .then(data => {
          return vm.syncRelatedDevices();
        });
    };

    vm.update = (device) => {
      device._isLoading = true;
      return $http.post(`/devices/relatedDevices/${device.deviceId}`, device._custom)
        .then(data => {
          device.custom = device._custom;
        }).finally(() => { device._isLoading = false; });
    };

  }
]);
