angular
.module('com.yonomi.testdevice.commandCtlr', [])
  .controller('commandCtlr', [
    '$scope',
    '$http',
    function (vm, $http) {
      vm.commands = null;

      let loadCommands = () => {
        $http.post("/device/requests", {
            method: 'get /commands',
            data: "{}"
        }).then(response => {
          vm.commands = response.data.result.body;
        })
      };

    loadCommands();


    }]);
