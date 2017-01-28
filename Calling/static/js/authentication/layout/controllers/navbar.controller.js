(function () {
  'use strict';

  angular
    .module('mainApp.layout.controllers')
    .controller('NavbarController', NavbarController)
    .controller('LeftCtrl', LeftCtrl);

  NavbarController.$inject = ['$scope', 'Authentication', '$timeout', '$mdSidenav', '$log'];
  LeftCtrl.$inject = ['$scope', '$timeout', '$mdSidenav', '$log'];


  function NavbarController($scope, Authentication, $timeout, $mdSidenav, $log) {
    var vm = this;

    vm.logout = logout;

    // The proble with below is that it gives error if the user is not logged in
    /**
     * @name logout
     * @desc Log the user out
     * @memberOf mainApp.layout.controllers.NavbarController
     */
    function logout() {
      Authentication.logout();

    }

    $scope.toggleLeft = buildDelayedToggler('left');

    /* Supplies a function that will continue to operate until the
     * time is up. */
    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }
     // * Build handler to open/close a SideNav; when animation finishes
     // * report completion in console     
    function buildDelayedToggler(navID) {
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }

  }

  function LeftCtrl($scope, $timeout, $mdSidenav, $log){
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });

    };
  }


})();