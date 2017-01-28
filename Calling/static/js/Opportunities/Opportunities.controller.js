var app = angular 
	.module('mainApp.Opportunities.controllers', [
		'ngMaterial',
		'ngMessages', 
		'material.svgAssetsCache',
		'ngCookies']);


app.controller('OpportunitiesController', [
	'$scope',
	'$http',
	'$location',
	'$mdDialog', 
	'$cookies', 
	'Authentication',
	'Toast',
	'$window',
	'$route', 
	'$routeParams', 
	'$mdToast',
	'myutils',
	function($scope, $http, $location, $mdDialog, $cookies, Authentication, Toast, $window, $route, $routeParams, $mdToast, myutils) {
		myutils.progressBar();
		var vm = this
		console.log('OpportunitiesController has been called!!')
		if (Authentication.isAuthenticated() == false){
			console.log('youre not logged in! redirecting to login...');
			window.location = '/login';
			} else {
			var id = Authentication.getAuthenticatedAccount().id;


			// fetchOpportunities
			// Sort Opps in five lists: unqualified, contacted, meeting, negotiating, closed
			var fetchOpportunities = function() {
				$http.get('/api/v1/accounts/' + id + '/Opportunities/?format=json')
				.then(function(response) {
					console.log('success fetching opps')
					Opportunities = response.data

					for(var i = 0; i < Opportunities.length; i++){						
						Opportunities[i].formattedDateClose = moment(Opportunities[i].DateClose).format('Do MMM YY');
					}

					vm.unqualifiedOpportunities = Opportunities.filter(function(obj) {
						return obj.qualify == 'unqualified';
					})

					$scope.unqualifiedTotalSize = 0
					for(var i = 0; i < vm.unqualifiedOpportunities.length; i++) {
						$scope.unqualifiedTotalSize += parseInt(vm.unqualifiedOpportunities[i].size)
					}
					


					vm.contactedOpportunities = Opportunities.filter(function(obj) {
						return obj.qualify == 'contacted';
					})
					$scope.contactedTotalSize = 0
					for(var i = 0; i < vm.contactedOpportunities.length; i++) {
						$scope.contactedTotalSize += parseInt(vm.contactedOpportunities[i].size)				
					}



					vm.meetingOpportunities = Opportunities.filter(function(obj) {
						return obj.qualify == 'meeting';
					})

					$scope.meetingTotalSize = 0
					for(var i = 0; i < vm.meetingOpportunities.length; i++) {
						$scope.meetingTotalSize += parseInt(vm.meetingOpportunities[i].size)
					}



					vm.negotiatingOpportunities = Opportunities.filter(function(obj) {
						return obj.qualify == 'negotiating';
					})
					$scope.negotiatingTotalSize = 0
					for(var i = 0; i < vm.negotiatingOpportunities.length; i++) {
						$scope.negotiatingTotalSize += parseInt(vm.negotiatingOpportunities[i].size)
					}



					vm.closedOpportunities = Opportunities.filter(function(obj) {
						return obj.qualify == 'closed';
					})
					$scope.closedTotalSize = 0
					for(var i = 0; i < vm.closedOpportunities.length; i++) {
						$scope.closedTotalSize += parseInt(vm.closedOpportunities[i].size)
					}

					console.log(Opportunities)
					if (Opportunities.length == 0) {
						Toast.showToast('You have no opportunities. Create one now by pressing the button at the top of this page.')
					}


				}, function(errResponse) {
					console.error('error with fetching opps')
				})
				myutils.hideWait();
			};
			fetchOpportunities();

			// Modal
			$scope.addModal = function(ev) {
				console.log('test')
				// Opens the Modal
			    $mdDialog.show({
			      // controller: DialogController,
			      contentElement: '#addModal', 
			      parent: angular.element(document.body),
			      targetEvent: ev,
			      clickOutsideToClose:true,
			      fullscreen: $scope.customFullscreen
			    })

				$http.get('/api/v1/accounts/' + id + '/Contacts/?format=json')
				.then(function(response) {
						console.log('contacts success!');
						$scope.contactList = response.data
					}, function(errResponse) {
						console.error('contacts error!');
					});
				$http.get('/api/v1/accounts/' + id + '/Leads/?format=json')
				.then(function(response) {
						console.log(response.data);
						// response.data.sort(function(a, b){
						// 	if(a.name < b.name) return -1;
						// 	if(a.name > b.name) return -1;
						// 	return 0;
						// })
						console.log(response.data);

						$scope.leadList = response.data
					}, function(errResponse) {
						console.error('leads error!');
					});
			};


			$scope.addModalOpportunitySubmit = function() {
				vm.addOpportunity.lead_id = vm.addOpportunity.lead.id;
				delete vm.addOpportunity.lead;
				vm.addOpportunity.DateClose = moment(vm.addOpportunity.DateCloseUnformatted).format()
				delete vm.addOpportunity.DateCloseUnformatted;

				console.log(vm.addOpportunity);
				$http.post('/api/v1/Opportunities/', vm.addOpportunity)
				.then(function(response) {
					console.log(vm.addOpportunity + ' was posted successfully');
					$route.reload();
					Toast.showToast('New opportunity has been created.');
				}, function(errResponse) {
					console.error('Error with posting');
					Toast.showToast('New opportunity has been created.');
				});
			}

			$scope.addModalLeadSubmit = function() {
				console.log(vm.addLead);
				$http.post('/api/v1/Leads/', vm.addLead)
				.then(function(response) {
					console.log(vm.addLead + ' was posted successfully');
					$route.reload();
					Toast.showToast('New lead has been created.');
				}, function(errResponse) {
					Toast.showToast('Error creating lead.');
					console.error('Error with posting');
				});
			}

			$scope.addModalContactSubmit = function() {
				vm.addContact.lead_id = vm.addContact.lead.id;
				delete vm.addContact.lead;
				console.log(vm.addContact);
				$http.post('/api/v1/Contacts/', vm.addContact)
				.then(function(response) {
					console.log(vm.addLead + ' was posted successfully');
					$route.reload();
					Toast.showToast('New contact has been created.');
				}, function(errResponse) {
					Toast.showToast('Error creating contact.');
					console.error('Error with posting');
				});
			}

			

			$scope.openMenu = function($mdOpenMenu, ev) {
				originatorEv = ev;
				$mdOpenMenu(ev);
			};




			// Opens the editOpp modal
			$scope.editOppModal = function(opp, ev) {
				$scope.opp = opp;
			    $mdDialog.show({
			      contentElement: '#editOppModal', 
			      parent: angular.element(document.body),
			      targetEvent: ev,
			      clickOutsideToClose:true,
			      fullscreen: $scope.customFullscreen
			    })

				$http.get('/api/v1/accounts/' + id + '/Leads/?format=json')
				.then(function(response) {
						$scope.leadList = response.data
					}, function(errResponse) {
					});
			};

			// Closes any modal
			$scope.cancel = function() {
				$mdDialog.cancel();
			};

			// Submits info to edit opp modal
			$scope.editOppModalSubmit = function(opp) {
				try {
					editOppModalSubmit.lead_id = vm.editOppModal.lead.id;
					// delete vm.editOppModal.lead;
				} catch(err) {
					editOppModalSubmit = {}
					editOppModalSubmit.lead_id = opp.lead.id
				}

				try {
					editOppModalSubmit.DateClose = moment(vm.editOppModal.DateCloseUnformatted).format()
				} catch(err) {
					editOppModalSubmit.DateClose = opp.DateClose
				}


				try {
					if (vm.editOppModal.size == undefined) {
						editOppModalSubmit.size = opp.size
					} else {
						editOppModalSubmit.size = vm.editOppModal.size
					}	
				} catch(err) {
					editOppModalSubmit.size = opp.size
				}

				try {
					if (vm.editOppModal.qualify == undefined){
						editOppModalSubmit.qualify = opp.qualify
					} else {
						editOppModalSubmit.qualify = vm.editOppModal.qualify
					}
				} catch(err) {
					editOppModalSubmit.qualify = opp.qualify
				}

				try {
					if (vm.editOppModal.comments == undefined){
						editOppModalSubmit.comments = opp.comments
					} else {
						editOppModalSubmit.comments = vm.editOppModal.comments
					}
				} catch(err) {
					editOppModalSubmit.comments = opp.comments
				}
				

				$http.put('/api/v1/Opportunities/' + opp.id + '/', editOppModalSubmit)
				.then(function(response) {
					console.log(vm.addOpportunity + ' was posted successfully');
					$route.reload();
					Toast.showToast('Opportunity modified.');
				}, function(errResponse) {
					console.error('Error with posting');
					Toast.showToast('Error modifying opportunity.');
				});
			}






			$scope.deleteOpp = function(ev, unqualified) {

				var confirm = $mdDialog.confirm()
			        .title('Delete this opportunity')
			        .textContent('Are you sure?')
			        .targetEvent(ev)
			        .ok('Delete')
			        .cancel('Cancel')

			      $mdDialog.show(confirm).then(function() {
					originatorEv = ev;
					console.log(unqualified.id); 
					$http.delete('/api/v1/Opportunities/' + unqualified.id + '/?format=json' )
					.then(function(response) {
						console.log(unqualified.id + ' deletion success!');
						Toast.showToast('Opportunity has been deleted.');
						$route.reload();
					}, function(errResponse) {
						console.error('deletion error!');
						Toast.showToast('Could not delete opportunity.');
					});
		          }, function() {
		          });
			}



	}
}]);