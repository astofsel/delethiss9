(function () {
  'use strict';

  angular
    .module('mainApp.profiles', [
      'mainApp.profiles.controllers',
      'mainApp.profiles.services'
    ]);

  angular
    .module('mainApp.profiles.controllers', ['ngCookies', 'djng.rmi', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache']);

  angular
    .module('mainApp.profiles.services', []);
})();