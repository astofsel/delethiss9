/**
* Profile
* @namespace mainApp.profiles.services
*/
(function () {
  'use strict';

  angular
    .module('mainApp.profiles.services')
    .factory('Profile', Profile);

  Profile.$inject = ['$http'];

  /**
  * @namespace Profile
  */
  function Profile($http) {
    /**
    * @name Profile
    * @desc The factory to be returned
    * @memberOf mainApp.profiles.services.Profile
    */
    var Profile = {
      destroy: destroy,
      get: get,
      update: update
    };

    return Profile;

    /////////////////////

    /**
    * @name destroy
    * @desc Destroys the given profile
    * @param {Object} profile The profile to be destroyed
    * @returns {Promise}
    * @memberOf mainApp.profiles.services.Profile
    */
    function destroy(id) {
      console.log('going to be destroyed, id: ' + id)
      return $http.delete('/api/v1/accounts/' + id + '/');
    }


    /**
    * @name get
    * @desc Gets the profile for user with username `username`
    * @param {string} username The username of the user to fetch
    * @returns {Promise}
    * @memberOf mainApp.profiles.services.Profile
    */
    function get(id) {
      console.log('Getting this profile: ' + id);
      return $http.get('/api/v1/accounts/' + id + '/');
    }


    /**
    * @name update
    * @desc Update the given profile
    * @param {Object} profile The profile to be updated
    * @returns {Promise}
    * @memberOf mainApp.profiles.services.Profile
    
    * There is still a problem... althuogh the profile gets edited in the database,
    * the $cookie doesn't.. Not a big problem for now I think. 
    */
    function update(profile) {
      console.log('going to be updated id: '+profile.id);
      return $http.put('/api/v1/accounts/' + profile.id + '/', profile);
    }
  }
})();