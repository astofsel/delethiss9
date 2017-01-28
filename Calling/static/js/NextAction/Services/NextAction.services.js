(function () {
	'use strict';

	angular
		.module('mainApp.NextAction.services')
		.factory('NextActionSer', NextActionSer);

	NextActionSer.$inject = ['$http'];

	function NextActionSer($http) {

		var NextActionSer = {
			getContacts: getContacts,
			getLeads: getLeads
		};

		return NextActionSer

		function getContacts(id) {
			return $http.get('/api/v1/accounts/' + id + '/Contacts/?format=json')
			.then(function(response) {
				console.log('contacts success!');
				console.log(response);
			}, function(errResponse) {
				console.error('contacts error!');
			});
		}

		function getLeads(id) {
			return $http.get('/api/v1/accounts/' + id + '/Leads/?format=json')
			.then(function(response) {
				console.log('leads success!');
				return response
			}, function(errResponse) {
				console.error('leads error!');
			});
		}

	}
}) ();