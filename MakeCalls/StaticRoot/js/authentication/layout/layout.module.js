(function () {
  'use strict';

  angular
    .module('mainApp.layout', [
      'mainApp.layout.controllers'
    ]);

  angular
    .module('mainApp.layout.controllers', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache']);
})();