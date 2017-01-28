var app = angular
	.module('mainApp.List.controllers', [
		'ngRoute', 
		'xeditable', 
		'ui.router', 
		'ngAnimate', 
		'ngMaterial', 
		'ngMessages', 
		'material.svgAssetsCache',
		'ngCookies']);


// This controller includes the functions to add/delete the companies added to the database
app.controller('ListController', [
	'$scope', 
	'$http', 
	'$location', 
	'$mdDialog',
	'$cookies',
	'$cookieStore',
	'Authentication',
	function($scope, $http, $location, $mdDialog, $cookies, $cookieStore, Authentication) {
	// this defines the parameters for fetchcompanies() 	
	var self = this
	self.lastCreated = '';
	self.items = [];
	self.newCompany = {};
	self.nextCompany = []; 
	

	// Check first if user logged in, if return False, do window location to /login. TEMPORARY SOLUTION
	if (Authentication.isAuthenticated() == false){
		console.log('youre not logged in! redirecting to login...');
		window.location = '/login';
	} else {
		var id = Authentication.getAuthenticatedAccount().id;

		// Below i'm trying to create a new FetchCompanies, one that only takes the contacts that are tied to the user
		var fetchCompanies = function(id) {
			return $http.get('/api/v1/accounts/' + id + '/CallAccounts/').then(function(response) {
				self.items = response.data;
			}, function(errResponse) {
				console.error('Error while fetching data'); 
			}); 
		}; 
		
		fetchCompanies(id);	

		// adds a new CA to username account
		// adds UUID to the CA
		self.add = function() {
			var generateUUID = function() {
					    var d = new Date().getTime();
					    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					        var r = (d + Math.random()*16)%16 | 0;
					        d = Math.floor(d/16);
					        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
					    });
					    return uuid;
					};
			self.newCompany.uniqueID = generateUUID();
			// self.newCompany.owner = user;
			console.log('this company is being posted:' + self.newCompany);
			$http.post('/api/v1/CallAccount/', self.newCompany)
			.then(function(response) {
				console.log(self.newCompany.CompanyName + ' posted successfully');
				self.lastCreated = response.data
				fetchCompanies(id);

			}, function(errResponse) {
				console.error('Error while posting & fetching data'); 
			});
		};

		self.deleteCompany = function(company) {
			var uniqueID = company.uniqueID;
			$http.delete('/api/v1/CallAccount/' + uniqueID + '?format=json')
			.then(function(response) {
				fetchCompanies(id);
				console.log(company.CompanyName+' was successfully deleted!');				
			})
		};

		// This is the code for the modal that is super cool!!!
		$scope.openModal = function(company) {
			$mdDialog.show(
				$mdDialog.alert()
				.clickOutsideToClose(true)
				.title('Company Name: ' + company.CompanyName)
				.textContent('Notes: ' + company.Notes_CallAccount)
				.ok('Close')
				.openFrom(angular.element(document.querySelector('#ViewButton')))
				.closeTo(angular.element(document.querySelector('#ViewButton')))
			);

		};

	};
}]);



