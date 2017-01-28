var app = angular 
	.module('mainApp.Leads.controllers', [
		'ngMaterial',
		'ngMessages', 
		'material.svgAssetsCache',
		'ngCookies',
		'djng.rmi',
		'ngSanitize',]);


// I tried to put this in a separate module, however it just doesn't register if I do that
// That's why for time reasons best to leave the config file just in the controller 
app.config(function(djangoRMIProvider, $httpProvider) {	   
    djangoRMIProvider.configure(tags);
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
});

app.controller('LeadsController', [
	'$scope',
	'$http',
	'$location',
	'$mdDialog', 
	'$cookies',
	'Authentication',
	'$window',
	'$route', 
	'$routeParams', 
	'djangoRMI',
	"$sce",
	'$anchorScroll',
	'Toast',
	'myutils', 
	function($scope, $http, $location, $mdDialog, $cookies, Authentication, $window, $route, $routeParams, djangoRMI, $sce, $anchorScroll, Toast, myutils) {
		var vm = this
		if (Authentication.isAuthenticated() == false){
			console.log('youre not logged in! redirecting to login...');
			window.location = '/login';
			} else {
				var id = Authentication.getAuthenticatedAccount().id;

				// Capture the lead ID below
				var leadRequested = $routeParams.lead;


				// var progressBar = function() {
				// 	myutils.showWait();
						
				// }
				myutils.progressBar();
				// Get Leads from user to check if Lead exists
				$http.get('/api/v1/accounts/' + id + '/Leads/?format=json')
					.then(function(response) {
						LeadsData = response.data
						console.log('success fetching leads')

						// Check if the lead exists in database
						// If it returns undefined, redirect 
						for (var i = 0; i < LeadsData.length; i++){
							if (LeadsData[i].id == leadRequested){
								var selectedLead = LeadsData[i]
							} 
						}

						if (selectedLead == undefined) {
							$location.url('/my_opportunities')
							console.log('Lead does not exist')
						} else {
							console.log(selectedLead.name + ' lead exists, page has been loaded');
							$scope.leadPage = selectedLead


							// Code goes here
							// Get opps
							$http.get('api/v1/Leads/' + leadRequested + '/Opportunities/?format=json')
								.then(function(response) {
									LeadsOpportunities = response.data
									console.log('success fetching opps')
									$scope.leadOpportunities = LeadsOpportunities

									for (var i = 0; i < LeadsOpportunities.length; i++) {
										$scope.leadOpportunities[i].FormattedDateClose = moment(LeadsOpportunities[i].DateClose).format('Do MMM YY')
									};
								}, function(errResponse) {
									console.error('error fetching opps')
								});
								// get contacts
							$http.get('api/v1/Leads/' + leadRequested + '/Contacts/?format=json')
								.then(function(response) {
									leadsContacts = response.data
									console.log('success fetching contacts')
									$scope.LeadsContacts = leadsContacts
								}, function(errResponse) {
									console.error('error fetching contacts')
								});



							

								// get activity
								// Create functions of each activity
								// Then chain these into one big promise 
								// Put all data into one leadAcitivty array

								// get tasks
							var fetchTasks = function() {
								return $http.get('api/v1/Leads/' + leadRequested + '/Tasks/?format=json')
									.then(function(response) {
										LeadsTasks = response.data
										console.log('success fetching tasks')
										$scope.leadTasks = LeadsTasks

										for (var i = 0; i < LeadsTasks.length; i++) {
											$scope.leadTasks[i].type = 'Task';
											var timezoneEurope = moment(LeadsTasks[i].DueDate).tz('Europe/Amsterdam').format()
											$scope.leadTasks[i].FormattedDateTime = moment(timezoneEurope).fromNow();
										};
										return $scope.leadTasks
									}, function(errResponse) {
										console.error('error fetching tasks')
									});
								};

							// get emails
							var fetchEmails = function() {
								return $http.get('api/v1/Leads/' + leadRequested + '/Emails/?format=json')
									.then(function(response) {
										LeadsEmails = response.data
										console.log('success fetching emails')
										$scope.leadsEmails = LeadsEmails																		
										
										for (var i = 0; i < LeadsEmails.length; i++) {
											$scope.leadsEmails[i].sender = LeadsEmails[i].sender
											$scope.leadsEmails[i].message_id = LeadsEmails[i].message_id
											$scope.leadsEmails[i].type = 'Email';
											var timezoneEurope = moment(LeadsEmails[i].DateTime).tz('Europe/Amsterdam').format()
											$scope.leadsEmails[i].FormattedDateTime = moment(timezoneEurope).fromNow()											

											$scope.leadsEmails[i].EmailContent = 
											'From: ' + LeadsEmails[i].from_field_name + '<br>' + 'To: ' + 
											LeadsEmails[i].sender_name + '</br>' + 'Subject: ' + LeadsEmails[i].subject + 
											'<br>' + '</br>' + LeadsEmails[i].EmailContent

										};
										return $scope.leadsEmails;
									}, function(errResponse) {
										console.error('error fetching calls')
									});
							}

							// get phone calls
							var fetchPhoneCalls = function(){
								 return $http.get('api/v1/Leads/' + leadRequested + '/PhoneCalls/?format=json')
									.then(function(response) {
										vm.LeadsPhoneCalls = response.data
										console.log('success fetching calls')
										$scope.leadsPhoneCalls = vm.LeadsPhoneCalls
										for (var i = 0; i < vm.LeadsPhoneCalls.length; i++) {
											$scope.leadsPhoneCalls[i].type = 'Phone Call';
											var timezoneEurope = moment(vm.LeadsPhoneCalls[i].DateTime).tz('Europe/Amsterdam').format()
											$scope.leadsPhoneCalls[i].FormattedDateTime = moment(timezoneEurope).fromNow();
										};
										return $scope.leadsPhoneCalls;
									});						
							}		

							var promiseTasks = fetchTasks();
							var promiseEmails = fetchEmails();
							var promisePhoneCalls = fetchPhoneCalls();

							promisePhoneCalls.then(function(promisePhoneCalls) {
								promiseEmails.then(function(promiseEmails){
									promiseTasks.then(function(promiseTasks){


										// Put them activities an array called leadActivity
										// Id and Task are needed in order to identify when user wants to interact
										// DateTimeString is used to sort leadActivity
										leadActivity = []
										for (var i = 0; i < promiseTasks.length; i++) {
											var obj = { 
												id: promiseTasks[i].id,
												type: 'Task',
												name: promiseTasks[i].name,
												DateTimeString: new Date(promiseTasks[i].DueDate).getTime(),
												FormattedDateTime: promiseTasks[i].FormattedDateTime,
												description: promiseTasks[i].description
											}
											leadActivity.push(obj);
										};

										for (var i = 0; i < promiseEmails.length; i++) {											
											var obj = { 
												id: promiseEmails[i].id,
												type: 'Email',
												name: promiseEmails[i].contact.fname + ' ' + promiseEmails[i].contact.lname,
												DateTimeString: new Date(promiseEmails[i].DateTime).getTime(),
												FormattedDateTime: promiseEmails[i].FormattedDateTime,
												description: promiseEmails[i].EmailContent,
												from_field: promiseEmails[i].from_field,
												message_id: promiseEmails[i].message_id
											}
											leadActivity.push(obj);
										};

										for (var i = 0; i < promisePhoneCalls.length; i++) {
											var obj = { 
												id: promisePhoneCalls[i].id,
												type: 'Phone Call',
												name: promisePhoneCalls[i].contact.fname + ' ' + promisePhoneCalls[i].contact.lname,
												DateTimeString: new Date(promisePhoneCalls[i].DateTime).getTime(),
												FormattedDateTime: promisePhoneCalls[i].FormattedDateTime,
												description: promisePhoneCalls[i].comments
											}
											leadActivity.push(obj);
										};

										// Sort activities by date
										leadActivity.sort(function(a,b) {
											return b.DateTimeString - a.DateTimeString
										});

										$scope.leadActivity = leadActivity;
										console.log(leadActivity)

									})
									myutils.hideWait();
								})

							})
							// End of the promise 




							// Uses djangoRMI to invoke a remote method
							// These methods are found in Calling.views.nav
							$scope.sendEmail = function() {
								myutils.progressBar();

								var auth_username = Authentication.getAuthenticatedAccount().username
								var email_to = $scope.email_to;
								var email_subject = $scope.email_subject;
								var email_body = $scope.email_body;

								var in_data = { email_to: email_to, email_subject: email_subject, email_body: email_body, auth_username: auth_username };
								console.log('The email contains: ' + in_data);
								djangoRMI.sendEmail(in_data)
									.success(function(out_data) {
										$route.reload();
										Toast.showToast('Email sent.');
										myutils.hideWait();
									}), function(errResponse) {
											Toast.showToast('Email not sent. Are you logged in?')
											myutils.hideWait();
										};
							};

							// Refresh emails in database using remote invocation function
							$scope.updateEmailDatabase = function() {
								myutils.progressBar();
								console.log('update email database called')
								djangoRMI.updateEmailDatabase()
									.success(function(out_data) {
										$route.reload();
										myutils.hideWait();
										Toast.showToast('Email is now synchronised.');
									});
							};

							$scope.deleteLead = function(ev) {
								var confirm = $mdDialog.confirm()
							        .title('Delete ' + selectedLead.name)
							        .textContent('Are you sure?')
							        .targetEvent(ev)
							        .ok('Delete')
							        .cancel('Cancel')
							      $mdDialog.show(confirm).then(function() {
									originatorEv = ev;
									$http.delete('/api/v1/Leads/' + leadRequested + '/?format=json' )
									.then(function(response) {
										console.log(selectedLead.name + ' deletion success!');
										$location.url('/my_opportunities');
										Toast.showToast('Lead has been deleted.');
									}, function(errResponse) {
										console.error('deletion error!');
									});
						          }, function() {
						          });
							}




							// When in mobile, this scrolls down to the id = anchorEmail
							$scope.gotoEmail = function() {
								$location.hash('anchorEmail')
								$anchorScroll();
							};




							$scope.addModal = function(ev) {
							    $mdDialog.show({
							      contentElement: '#addModal', 
							      parent: angular.element(document.body),
							      targetEvent: ev,
							      clickOutsideToClose:true,
							      fullscreen: $scope.customFullscreen
							    })

								$http.get('/api/v1/accounts/' + id + '/Contacts/?format=json')
								.then(function(response) {
										$scope.contactList = response.data
									}, function(errResponse) {
										console.error('contacts error!');
									});

								$scope.addModalOpportunitySubmit = function() {
									console.log(leadRequested)
									vm.addOpportunity.lead_id = leadRequested;
									vm.addOpportunity.DateClose = moment(vm.addOpportunity.DateCloseUnformatted).format()
									delete vm.addOpportunity.DateCloseUnformatted;

									console.log(vm.addOpportunity);
									$http.post('/api/v1/Opportunities/', vm.addOpportunity)
									.then(function(response) {
										console.log(vm.addOpportunity + ' was posted successfully');
										$route.reload();
										myutils.hideWait();
									}, function(errResponse) {
										console.error('Error with posting');
									});
								}

								$scope.addModalContactSubmit = function() {
									vm.addContact.lead_id = leadRequested;
									console.log(vm.addContact);
									$http.post('/api/v1/Contacts/', vm.addContact)
									.then(function(response) {
										console.log(vm.addLead + ' was posted successfully');
										$route.reload();
										Toast.showToast('New contact has been created.');
									}, function(errResponse) {
										console.error('Error with posting');
									});
								}
							};


							// Closes any modal
							$scope.cancel = function() {
								$mdDialog.cancel();
							};




							// Option menu for each activity 
							$scope.openMenu = function($mdOpenMenu, ev) {
								originatorEv = ev;
								$mdOpenMenu(ev);
							};


							// This needs to change 
							// Needs to divide Tasks, Emails, and Calls 
							// so that it can send the correct api call 
							$scope.deleteActivity = function(ev, activity) {
								originatorEv = ev;
								var confirm = $mdDialog.confirm()
							        .title('Delete')
							        .textContent('Are you sure?')
							        .targetEvent(ev)
							        .ok('Delete')
							        .cancel('Cancel')
							      $mdDialog.show(confirm).then(function() {
							      	
									if (activity.type == 'Task') {
										$http.delete('/api/v1/Tasks/' + activity.id + '/?format=json')
										.then(function(response) {
											$route.reload();
											Toast.showToast('Task has been deleted.')
										}), function(errResponse) {
											console.log('Error deleting')
										}
									} else {
										if (activity.type == 'Email') {
											myutils.progressBar();
											var out_data = activity
											// Deleting email also from Gmail using contextio (method in Calling.views)
											djangoRMI.deleteEmail(out_data)
												.success(function() {
													$http.delete('/api/v1/Emails/' + activity.id + '/?format=json')
														.then(function(response) {
															myutils.hideWait();
															$route.reload();
															Toast.showToast('Email has been deleted.')
														}), function(errResponse) {
															myutils.hideWait();
															console.log('Error deleting')
													}
											})
										} else {
											$http.delete('/api/v1/PhoneCalls/' + activity.id + '/?format=json')
												.then(function(response) {
													console.log('Call has been deleted')
													$route.reload();
													Toast.showToast('Phone call has been deleted.')
												}), function(errResponse) {
													console.log('Error deleting')
												} 
										}
									}
								})
							}




							// Functions for Contacts Menu

							$scope.viewContact = function(contact, ev) {
								$scope.contact = contact;
							    $mdDialog.show({
							      contentElement: '#editContact', 
							      parent: angular.element(document.body),
							      targetEvent: ev,
							      clickOutsideToClose:true,
							      fullscreen: $scope.customFullscreen
							    })

							};


							// Submits info to edit opp modal
							$scope.editContactSubmit = function(contact) {
								editContactSubmit = {}
								try {
									if (vm.editContact.fname == undefined) {
										editContactSubmit.fname = contact.fname
									} else {
										editContactSubmit.fname = vm.editContact.fname
									}	
								} catch(err) {
									editContactSubmit.fname = contact.fname
								}

								try {
									if (vm.editContact.lname == undefined) {
										editContactSubmit.lname = contact.lname
									} else {
										editContactSubmit.lname = vm.editContact.lname
									}	
								} catch(err) {
									editContactSubmit.lname = contact.lname
								}

								try {
									if (vm.editContact.email == undefined) {
										editContactSubmit.email = contact.email
									} else {
										editContactSubmit.email = vm.editContact.email
									}	
								} catch(err) {
									editContactSubmit.email = contact.email
								}

								try {
									if (vm.editContact.PhoneNumber == undefined) {
										editContactSubmit.PhoneNumber = contact.PhoneNumber
									} else {
										editContactSubmit.PhoneNumber = vm.editContact.PhoneNumber
									}	
								} catch(err) {
									editContactSubmit.PhoneNumber = contact.PhoneNumber
								}

								editContactSubmit.lead_id = leadRequested
								console.log(editContactSubmit)

								$http.put('/api/v1/Contacts/' + contact.id + '/', editContactSubmit)
								.then(function(response) {
									console.log('Contact edited successfully');
									$route.reload();
									Toast.showToast('Contact modified.');
								}, function(errResponse) {
									console.error('Error with posting');
									Toast.showToast('Error modifying contact.');
								});
							}



							$scope.deleteContact = function(ev, contact) {
								var confirm = $mdDialog.confirm()
							        .title('Delete contact')
							        .textContent('Are you sure?')
							        .targetEvent(ev)
							        .ok('Delete')
							        .cancel('Cancel')
							      $mdDialog.show(confirm).then(function() {
									originatorEv = ev;
									$http.delete('/api/v1/Contacts/' + contact.id + '/?format=json')
									.then(function(response) {
										$route.reload();
										Toast.showToast('Contact ' + contact.fname + ' ' + contact.lname + ' has been deleted.')
									}), function(errResponse) {
										console.log('deletion error!')
										Toast.showToast('Error! Could not delete contact.')
									}
								})

							}


							$scope.replyToButton = function(email) {
								$scope.email_to = email
							}




							// $scope.progressBar();
							// myutils.hideWait();




						




					}
				}, function(errResponse) {
					console.error('error fetching leads')
			});
		}
	}
]);


