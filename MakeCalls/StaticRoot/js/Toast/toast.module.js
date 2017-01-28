(function () {
  'use strict';

  angular
    .module('mainApp.toast', [
      'mainApp.toast.services'
    ]);

  angular
    .module('mainApp.toast.services', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache']);
})();