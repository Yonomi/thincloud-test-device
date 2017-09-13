angular.module('com.yonomi.testdevice',[
  'ngRoute',
  'com.yonomi.testdevice.main'
])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/main',{
      templateUrl: 'views/main.html',
      controller: 'loginCtlr'
    })
      // .otherwise({
      //   redirectTo: '/home'
      // })
  }])

  .run(function($rootScope, $location){
    $location.path('/main');
    $rootScope.$on("$routeChangeStart", function(event, next,current){
      $location.path('/main');
      // if(!$rootScope.isAuthenticated()){
      //
      // } else {
      //
      // }

      // $location.path('/login');
    })

  });
