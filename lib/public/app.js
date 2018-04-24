angular
  .module('com.yonomi.testdevice', [
    'ngRoute',
    'com.yonomi.testdevice.main',
    'com.yonomi.testdevice.requestCtlr',
    'com.yonomi.testdevice.commandCtlr',
    'com.yonomi.testdevice.storageCtlr',
    'com.yonomi.testdevice.commissionCtlr',
    'com.yonomi.testdevice.relatedDevicesCtlr'
  ])
  .config([
    '$routeProvider',
    function ($routeProvider) {
      $routeProvider
        .when('/main', {
          templateUrl: 'views/main.html'
        })
        .when('/commission', {
          templateUrl: 'views/commission.html'
        });
      // .otherwise({
      //   redirectTo: '/home'
      // })
    }
  ])

  .run(function ($rootScope, $location) {
    $location.path('main');
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      // if(!$rootScope.isAuthenticated()){
      //
      // } else {
      //
      // }
      // $location.path('/login');
    });
  });
