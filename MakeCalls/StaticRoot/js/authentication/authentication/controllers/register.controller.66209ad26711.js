(function () {
  'use strict';

  angular.module('mainApp.authentication.controllers')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$location', '$scope', 'Authentication', 'Toast'];

  /**
  * @namespace RegisterController
  */
  function RegisterController($location, $scope, Authentication, Toast) {
    var vm = this;

    vm.register = register;

    /**
    * @name register
    * @desc Register a new user
    * @memberOf mainApp.authentication.controllers.RegisterController
    */
    function register() {
      if (vm.password !== vm.confirmPassword) {
        Toast.showToast('Passwords don\'t match!')
      } else {       
        Authentication.register(vm.email, vm.password, vm.username);
      }
    }
  activate();

  function activate() {
    // If the user is authenticated, they should not be here.
    if (Authentication.isAuthenticated()) {
      $location.url('/');
    }
  }
    
  }


})();