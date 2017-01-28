/**
* ProfileSettingsController
* @namespace mainApp.profiles.controllers
*/
(function () {

  angular
    .module('mainApp.profiles.controllers', ['djng.rmi'])
    .config(function(djangoRMIProvider, $httpProvider) {    
      // For an unkown reaoson, LINE 405 of django-angular.js throws as error of tags
      // The if statement checks if Tags contains an object, and if it doesn't ,throws an error
      // Tags contains objects, so not sure why the error occurs 
      djangoRMIProvider.configure(tags);
      $httpProvider.defaults.xsrfCookieName = 'csrftoken';
      $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    })
    .controller('ProfileSettingsController', ProfileSettingsController);

  ProfileSettingsController.$inject = [
    '$scope', '$location', '$routeParams', 'Authentication', 'Profile', '$cookies', 'djangoRMI', '$mdDialog', 'Toast', 'myutils'
  ];

  /**
  * @namespace ProfileSettingsController
  */
  function ProfileSettingsController($scope, $location, $routeParams, Authentication, Profile, $cookies, djangoRMI, $mdDialog, Toast, myutils) {
    var vm = this;

    vm.destroy = destroy;
    vm.update = update;


    activate();


    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated.
    * @memberOf mainApp.profiles.controllers.ProfileSettingsController
    */
    function activate() {
      myutils.progressBar();
      var isAuthenticated = Authentication.isAuthenticated();
      var authenticatedAccount = Authentication.getAuthenticatedAccount();
      console.log('The acount is authenticated: '+ isAuthenticated);

      // Redirect if not logged in
      if (!isAuthenticated) {
        window.location ='/login';
        console.log('You are not authorized to view this page.');
      } 
      var id = Authentication.getAuthenticatedAccount().id;

      Profile.get(id).then(profileSuccessFn, profileErrorFn);

      /**
      * @name profileSuccessFn
      * @desc Update `profile` for view
      */
      function profileSuccessFn(data, status, headers, config) {
        vm.profile = data.data;
      }

      /**
      * @name profileErrorFn
      * @desc Redirect to index
      */
      function profileErrorFn(data, status, headers, config) {
        $location.url('/');
        Toast.showToast('That user does not exist.');
        console.log('That user does not exist.');
      }
      myutils.hideWait();
    }


    /**
    * @name destroy
    * @desc Destroy this user's profile
    * @memberOf mainApp.profiles.controllers.ProfileSettingsController
    */
    function destroy(ev) {
      var confirm = $mdDialog.confirm()
        .title('Delete your account')
        .textContent('Are you sure?')
        .targetEvent(ev)
        .ok('Delete')
        .cancel('Cancel')

      $mdDialog.show(confirm).then(function() {
            Profile.destroy(vm.profile.id).then(profileSuccessFn, profileErrorFn);
          }, function() {
          });
      // 

      /**
      * @name profileSuccessFn
      * @desc Redirect to index and display success snackbar
      */
      function profileSuccessFn(data, status, headers, config) {
        Authentication.unauthenticate();
        window.location = '/login';
        Toast.showToast('Your account has been deleted.');
      }


      /**
      * @name profileErrorFn
      * @desc Display error snackbar
      */
      function profileErrorFn(data, status, headers, config) {
        console.log(data.error);
      }
    }


    /**
    * @name update
    * @desc Update this user's profile
    * @memberOf mainApp.profiles.controllers.ProfileSettingsController
    */
    function update() {
      console.log('Going to update this account ' + vm.profile)
      Profile.update(vm.profile).then(profileSuccessFn, profileErrorFn);

      /**
      * @name profileSuccessFn
      * @desc Show success snackbar
      */
      function profileSuccessFn(data, status, headers, config) {
        Authentication.setAuthenticatedAccount(data.data);
        Toast.showToast('Your profile has been updated.');
        console.log('Your profile has been updated.');
      }


      /**
      * @name profileErrorFn
      * @desc Show error snackbar
      */
      function profileErrorFn(data, status, headers, config) {
        console.log(data.error);
      }
    }


    // Authenticate Gmail
    $scope.gmailLogin = function(){
      // Call gmailLogin function in Views
      djangoRMI.loginGmail()
        .success(function(out_data) {
          Toast.showToast('You are now logged into your Gmail account.');
      });
    }

    // De-Authenticate Gmail
    $scope.deleteCredentials = function(ev){

      var confirm = $mdDialog.confirm()
        .title('Delete Gmail Credentials')
        .textContent('Are you sure?')
        .targetEvent(ev)
        .ok('Delete')
        .cancel('Cancel')

      $mdDialog.show(confirm).then(function() {
          console.log('Deleting credentials')
          // Call deleteCredentials function in Views
          djangoRMI.deleteCredentials()
            .success(function() {
              Toast.showToast('You have now logged out of your Gmail account.');
          });
          }, function() {
          });     

    }

    



  }
})();