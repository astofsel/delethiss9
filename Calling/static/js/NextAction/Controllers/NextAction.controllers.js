var app = angular 
	.module('mainApp.NextAction.controllers', [
		'ngMaterial',
		'ngMessages', 
		'material.svgAssetsCache',
		'ngCookies']);


// Main controller

app.controller('NextActionCtrl', [
	'$scope',
	'$http',
	'$location',
	'$mdDialog', 
	'$cookies', 
	'Authentication',
	'NextActionSer',
	'$window',
	'$route', 
	'Toast',
	'myutils',
	function($scope, $http, $location, $mdDialog, $cookies, Authentication, NextActionSer, $window, $route, Toast, myutils) {
		var vm = this
		vm.nextCall = [];
		vm.secondCall = [];
		vm.thirdCall = [];
		vm.nextEmail = [];
		vm.nextTask = [];

		// Check if user is logged in. If not, return to /logins
		if (Authentication.isAuthenticated() == false){
			console.log('youre not logged in! redirecting to login...');
			window.location = '/login';
			} else {
			var id = Authentication.getAuthenticatedAccount().id;

			// Get next task
			// Sort by date 
			// Obtain [0]
			// Convert DateTime and pass as nextTaskmoment
			var fetchNextTask = function(id) {
				$http.get('/api/v1/accounts/' + id + '/Tasks/?format=json')
				.then(function(response){
					vm.unsortedTasks = response.data;

					// filter out completed tasks
					vm.unsortedFilteredTasks = vm.unsortedTasks.filter(function(obj) {
						return obj.completed !== true;
					});


					newArray = [];
					for(var i = 0; i < vm.unsortedFilteredTasks.length; i++){
						// convert DateTime to integer
						var DueDate = new Date(vm.unsortedFilteredTasks[i].DueDate).getTime()
						// Today's date in numbey format
						var today = new Date().getTime();
						// calculates diff between today and datetime, and gets rid of the (-)
						var diff = today - DueDate;
						if (diff < 0) {
							var diff = diff * -1;
						}
						// Pushes diff into array
						vm.unsortedFilteredTasks[i]['diff'] = diff
						// newArray.push([vm.unsortedFilteredTasks[i]]);
					}


					// sorts array according to the key
					vm.unsortedFilteredTasks.sort(function(a,b) {
						return a.diff - b.diff
					});
					vm.sortedFilteredTasks = vm.unsortedFilteredTasks;


					// Deletes diff from array
					for(var i = 0; i < vm.sortedFilteredTasks.length; i++){						
						delete vm.sortedFilteredTasks[i].diff;
					}

					vm.taskList = [];
					for(var i = 0; i < vm.sortedFilteredTasks.length; i++){						
						vm.taskList.push(vm.sortedFilteredTasks[i]);
						vm.taskList[i].formattedDateTime = moment(vm.sortedFilteredTasks[i].DueDate).format('h:mm, Do MMMM YYYY');
					}
					console.log(vm.taskList);
					if (vm.taskList.length == 0) {
						Toast.showToast('You have no tasks. Create one now by pressing the button at the top of this page.')
					}

					// vm.nextTaskMoment = moment(vm.sortedFilteredTasks[0].DueDate).format('h:mm, Do MMMM YYYY');
					// vm.nextTask = vm.sortedFilteredTasks[0];	
					myutils.hideWait();			
				}), function(errResponse){
				}

			}
			fetchNextTask(id);



			vm.logCall = function(nextTask) {
				
				// Saving task as complete, and have to set lead_id and contact_id manually
				nextTask.completed = true;
				nextTask.lead_id = nextTask.lead.id;
				nextTask.contact_id = nextTask.contact.id;

				console.log(nextTask);
				$http.put('api/v1/Tasks/' + nextTask.id + '/', nextTask)
				.then(function(response) {
					console.log('Task saved successfully');
				}, function(errResponse) {
					console.error('Error with put request');
				});

				// Creating a new logged call, then posting it
				newCall = {};
				var todayDateTime = new Date();
				// converting DateTime to ISO
				newCall.DateTime = moment(todayDateTime).format();
				newCall.completed = true;
				newCall.notes = nextTask.description;
				newCall.lead_id = nextTask.lead.id;
				newCall.contact_id = nextTask.contact.id;

				console.log(newCall);
				$http.post('api/v1/PhoneCalls/', newCall)
				.then(function(response) {
					console.log('logCall logged call successfully');
				}, function(errResponse) {
					console.error('Error with post request');
				});

				// reloading the route to refresh 
				vm.reloadRoute = function() {
					$route.reload();
				};
				vm.reloadRoute();				
			};



			$scope.amendTask = function(nextTask, inputDateTime) {
				// Get nextTask obj
				// grab new date 
				// convert new date in ISO with moment()

				nextTask.DueDate = moment(inputDateTime).format();
				nextTask.lead_id = nextTask.lead.id;
				nextTask.contact_id = nextTask.contact.id;
				console.log(nextTask);
				$http.put('api/v1/Tasks/' + nextTask.id + '/', nextTask)
				.then(function(response) {
					console.log('Task amended successfully');
					Toast.showToast('Task modified.')
				}, function(errResponse) {
					console.error('Error with put request');
				});
				vm.reloadRoute = function() {
					$route.reload();
				};
				vm.reloadRoute();								
			};



			$scope.deleteTask = function(nextTask) {
				$http.delete('api/v1/Tasks/' + nextTask.id + '?format=json')
				.then(function(response) {
					console.log(vm.nextTask.id);
					console.log(nextTask);
					$route.reload();
					console.log('deletion success!');
					Toast.showToast('Task deleted.')
				}, function(errResponse) {
					console.error('Error with deletion');
				});
			}


			$scope.markCompleted = function(nextTask) {
				nextTask.completed = true
				nextTask.lead_id = nextTask.lead.id;
				nextTask.contact_id = nextTask.contact.id;
				console.log(nextTask)
				$http.put('api/v1/Tasks/' + nextTask.id + '/', nextTask)
				.then(function(response) {
					console.log('Task completed successfully');
					Toast.showToast('Task marked as completed.')
				}, function(errResponse) {
					console.error('Error with put request');
				});
				$route.reload();
				
			};



			$scope.addTaskModal = function(ev) {
				// Opens the Modal
			    $mdDialog.show({
			      // controller: DialogController,
			      contentElement: '#addTaskModal', 
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
						console.log('lead success!');
						$scope.leadList = response.data
					}, function(errResponse) {
						console.error('leads error!');
					});
			};


			// Close addPhoneCallModal
			$scope.cancel = function() {
				$mdDialog.cancel();
			};


			$scope.addTaskModalSubmit = function() {				
				vm.addTask.DueDate = moment(vm.addTask.inputDateTime).format()
				delete vm.addTask.inputDateTime;
				// vm.addTask.name = document.getElementById('name').value;
				vm.addTask.notes = document.getElementById('textarea').value;
				vm.addTask.completed = false;
				vm.addTask.contact_id = vm.addTask.contact.id;
				vm.addTask.lead_id = vm.addTask.lead.id;

				console.log(vm.addTask);
				$http.post('/api/v1/Tasks/', vm.addTask)
				.then(function(response) {
					console.log(vm.addTask + ' added successfully');
					$route.reload();
					Toast.showToast('Task added.')
				}, function(errResponse) {
					console.error('Error with posting');
				});
			}



		}
	}
]);
