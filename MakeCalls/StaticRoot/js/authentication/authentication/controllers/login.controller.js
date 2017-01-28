(function () {
  'use strict';

  angular
    .module('mainApp.authentication.controllers')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', '$scope', 'Authentication', 'Toast'];

  /**
  * @namespace LoginController
  */
  function LoginController($location, $scope, Authentication, Toast) {
    var vm = this;

    vm.login = login;

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf mainApp.authentication.controllers.LoginController
    */
    function activate() {
      // If the user is authenticated, they should not be here.
      if (Authentication.isAuthenticated()) {
        window.location = '/app/#/next_action';
      }
    }

    /**
    * @name login
    * @desc Log the user in
    * @memberOf mainApp.authentication.controllers.LoginController
    */
    function login() {
      Authentication.login(vm.email, vm.password);
      
    }
  }
})();