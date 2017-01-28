(function () {
  'use strict';

  angular
    .module('mainApp.authentication.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$cookies', '$cookieStore', '$http', '$rootScope', 'Toast'];

  /**
  * @namespace Authentication
  * @returns {Factory}
  */
  function Authentication($cookies, $cookieStore, $http, $rootScope, Toast) {
    /**
    * @name Authentication
    * @desc The Factory to be returned
    */
    var Authentication = {
      getAuthenticatedAccount: getAuthenticatedAccount,
      isAuthenticated: isAuthenticated,
      login: login, 
      logout: logout,
      register: register,
      setAuthenticatedAccount: setAuthenticatedAccount,
      unauthenticate: unauthenticate
    };

    return Authentication;

    function register(email, password, username, password2) {
	      return $http.post('/api/v1/accounts/', {
	        username: username,
	        password: password,
	        email: email
	      }).then(registerSuccessFn, registerErrorFn);

	      function registerSuccessFn(data, status, headers, config) {
	      	Authentication.login(email, password);
	      	Toast.showToast('Success! Your profile has been created.');
	      }

	      function registerErrorFn(data, status, headers, config) {
	      	console.error('EPIC FAILURE :)');
	      }
    }

	function login(email, password) {
	  return $http.post('/api/v1/auth/login/', {
	    email: email, password: password
	  }).then(loginSuccessFn, loginErrorFn);

	  function loginSuccessFn(data, status, headers, config) {
	  	Authentication.setAuthenticatedAccount(data.data); 
	  	Toast.showToast('Welcome back! You are now logged in.');
	  	window.location = '/app/#/next_action';
	  	
	  }
	  function loginErrorFn(data, status, headers, config) {
	  	Toast.showToast('Did not recognise username/password combination.');
	  	console.error('Epic fAILURE!!');
	  }
	}



	// Returns account object if authenticated, otherwise 'undefined'
	function getAuthenticatedAccount(){
		if (!$cookies.get('user')) {
			return;
		}
		// return JSON.parse($cookies.authenticatedAccount);
		return $cookies.getObject('user');
	}

	// Stringify account object and store it in a cookie
	function setAuthenticatedAccount(account) {
		// the below code saves the account in cookies
		$cookies.putObject('user', account, {path: '/app/'});
	}

	// Check if current user is authenticated. Gives true is user is authenticated, else false
	function isAuthenticated() {
		console.log(!!$cookies.get('user'))
		return !!$cookies.get('user');
	}

	// Delete cookie where user object is stored
	function unauthenticate() {
		console.log($cookies.get('user') + ' will be unauthenticated');
		$cookies.remove('user');			
	}



	function logout() {
		return $http.post('/api/v1/auth/logout/')
			.then(logoutSuccessFn, logoutErrorFn); 

		function logoutSuccessFn(data, status, headers, config) {
			Authentication.unauthenticate();
			window.location = '/';
			Toast.showToast('You have been logged out. See you soon!');
		}

		function logoutErrorFn(data, status, headers, config) {
			console.error('Logout Error! Are you logged in?')
			Toast.showToast('Logout Error! Are you logged in?');
		}
	}

  }
}) ();

