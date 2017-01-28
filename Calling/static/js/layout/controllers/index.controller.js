/**
* IndexController
* @namespace mainApp.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('mainApp.layout.controllers')
    .controller('IndexController', IndexController);

  IndexController.$inject = ['$scope', 'Authentication', 'Calling'];

  /**
  * @namespace IndexController
  */
  function IndexController($scope, Authentication, Calling) {
    var vm = this;

    vm.isAuthenticated = Authentication.isAuthenticated();
    vm.callaccounts = [];

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf mainApp.layout.controllers.IndexController
    */
    function activate() {
      callaccounts.all().then(postsSuccessFn, postsErrorFn);

      $scope.$on('CallAccount.created', function (event, post) {
        vm.callaccounts.unshift(post);
      });

      $scope.$on('CallAccount.created.error', function () {
        vm.callaccounts.shift();
      });


      /**
      * @name postsSuccessFn
      * @desc Update posts array on view
      */
      function postsSuccessFn(data, status, headers, config) {
        vm.posts = data.data;
      }


      /**
      * @name postsErrorFn
      * @desc Show snackbar with error
      */
      function postsErrorFn(data, status, headers, config) {
        console.log('snackbar: error');
      }
    }
  }
})();