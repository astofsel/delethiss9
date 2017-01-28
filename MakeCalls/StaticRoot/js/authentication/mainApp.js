(function () {
  'use strict';

  angular.module('mainApp', [
    'mainApp.config',
    'mainApp.routes',
    'mainApp.authentication',
    'mainApp.toast',
    'mainApp.progressCircular',
    'mainApp.layout', 
    'mainApp.Navbar.services',
    'mainApp.List',
    'mainApp.profiles',
    'mainApp.Nextcall',    
    'mainApp.NextAction',
    'mainApp.Opportunities',
    'mainApp.Leads.controllers', 
    ]);

angular
  .module('mainApp')
  .run(run);

run.$inject = ['$http'];

/**
* @name run
* @desc Update xsrf $http headers to align with Django's defaults
*/
function run($http) {
  $http.defaults.xsrfHeaderName = 'X-CSRFToken';
  $http.defaults.xsrfCookieName = 'csrftoken';
}

  angular
    .module('mainApp.routes', ['ngRoute']);

  angular
  	.module('mainApp.config', []);

})();

