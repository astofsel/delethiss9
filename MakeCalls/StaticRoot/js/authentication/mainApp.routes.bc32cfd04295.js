(function () {
  'use strict';

  angular
    .module('thinkster.routes')
    .config(config);

  config.$inject = ['$routeProvider'];

  /**
  * @name config
  * @desc Define valid application routes
  */
  function config($routeProvider) {
    $routeProvider.when('/modal_test', {
      controller: 'RegisterController', 
      controllerAs: 'vm',
      templateUrl: 'nav/register/'
    }).when('/login', {
    	controller: 'LoginController', 
    	controllerAs: 'vm', 
    	templateUrl: '/login/'
    // }).when('/:username/settings', {
    //   controller: 'ProfileSettingsController', 
    //   controllerAs: 'vm', 
    //   templateUrl: '/templates/profiles/settings.html'
    }).otherwise('/');
	}
});