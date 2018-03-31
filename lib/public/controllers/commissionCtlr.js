angular
  .module('com.yonomi.testdevice.commissionCtlr', [])
  .controller('commissionCtlr', [
    '$scope',
    '$http',
    function (vm, $http, $location) {

    vm.port = 8883;
    vm.host = 'a30sls2kwzsz93.iot.us-west-2.amazonaws.com';
    vm.region = 'us-west-2';

      vm.commission = (host, port, region) =>{
        $http.post("/device/commission", {
          port: vm.port,
          host: vm.host,
          region: vm.region
        }).then(response => {
          console.log(response)
        })
      }

      vm.disableCommission = ()=>{
        return vm.port != null || vm.host != null || vm.region != null;
      }

    }]);
