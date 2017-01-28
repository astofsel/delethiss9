(function () {
  'use strict';

  angular
    .module('mainApp.authentication', [
      'mainApp.authentication.controllers',
      'mainApp.authentication.services'
    ]);

  angular
    .module('mainApp.authentication.controllers', []);

  angular
    .module('mainApp.authentication.services', ['ngCookies']);
})();