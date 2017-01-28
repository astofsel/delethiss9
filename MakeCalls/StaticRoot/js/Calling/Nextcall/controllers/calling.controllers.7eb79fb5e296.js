var app = angular.module('mainApp.Nextcall.controllers', [
	'ngRoute', 
	'xeditable', 
	'ui.router', 
	'ngAnimate', 
	'ngMaterial', 
	'ngMessages', 
	'material.svgAssetsCache']);

app.controller('NextcallController', [
	'$scope', 
	'$http', 
	'$location', 
	'$state', 
	'$route', 
	'$window',
	'Authentication',
	function(
		$scope, $http, $location, $state, $route, $window, Authentication) {
		var self = this;

		// Check first if user logged in, if return False, do window location to /login. TEMPORARY SOLUTION
		if (Authentication.isAuthenticated() == false){
			console.log('youre not logged in! redirecting to login...');
			window.location = '/login';
			} else {
			var id = Authentication.getAuthenticatedAccount().id;

			// The below code sorts the objects and chooses the one nearest to Date.now
			var fetchNextCompany = function(id) {

				$http.get('/api/v1/accounts/' + id + '/CallAccounts/?format=json').then(function(response) {
					self.sortedCompanies = response.data;				
					self.sortedCompanies.sort(function(a,b) { 				
					return new Date(b.Next_FU).getTime() - new Date(a.Next_FU).getTime()	
				});				
					self.nextCompany = self.sortedCompanies.slice(-1).pop();				
					}, function(errResponse) {
						console.error('Error while fetching data'); 
					});	
			};
			fetchNextCompany(id);

			self.CallBackLater = function(Next_FU, notes, nextCompany){
				nextCompany.Notes_CallAccount = document.getElementById(notes).value			
				// The below code transforms readable DateTime of the user into ISO time. It also removes the zulu time if there is any. 
				// If this does not function properly, REST will give a 400 Bad Request error. Very annoying. 
				// Ideally this should be made clearner, as right now single digits will give errors. So dates and hours have to be written
				// in double digits (e.g. 01:00, not 1:00)
				var hour = document.getElementById(Next_FU).innerHTML.substr(0,5);		
				var day = document.getElementById(Next_FU).innerHTML.charAt(7) + document.getElementById(Next_FU).innerHTML.charAt(8);
				var month = document.getElementById(Next_FU).innerHTML.charAt(10) + document.getElementById(Next_FU).innerHTML.charAt(11);
				var year = document.getElementById(Next_FU).innerHTML.substr(13,14);
				nextCompany.Next_FU = year + '-' + month + '-' + day + 'T' + hour;	

				$http.put('/api/v1/CallAccount/' + nextCompany.uniqueID + '/', nextCompany)
				.then(function(response) {
					console.log('nextCompany edited successfully');
				}, function(errResponse) {
					console.error('Error with put request'); 
				});

			}

			$scope.reloadRoute = function() {
				console.log('reloading window');
				$window.location.reload();
			}
		};
	}
	]);
