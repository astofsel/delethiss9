/**
* ProfileController
* @namespace mainApp.profiles.controllers
*/
(function () {
  'use strict';

  angular
    .module('mainApp.profiles.controllers')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$location', '$routeParams', 'Profile', '$cookies'];

  /**
  * @namespace ProfileController
  */
  function ProfileController($location, $routeParams, Profile, $cookies) {
    var vm = this;

    vm.profile = undefined;

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf mainApp.profiles.controllers.ProfileController
    */
    function activate() {
      var username = $routeParams.username.substr(1);

      Profile.get(username).then(profileSuccessFn, profileErrorFn);

      /**
      * @name profileSuccessProfile
      * @desc Update `profile` on viewmodel
      */
      function profileSuccessFn(data, status, headers, config) {
        vm.profile = data.data;
      }


      /**
      * @name profileErrorFn
      * @desc Redirect to index and show error Snackbar
      */
      function profileErrorFn(data, status, headers, config) {
        $location.url('/');
        console.log('That user does not exist.');
      }
    }
  }
})();