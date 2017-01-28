var app = angular.module('mainApp.Navbar.services', [
  'ngRoute', 
  'xeditable', 
  'ui.router', 
  'ngAnimate', 
  'ngMaterial', 
  'ngMessages', 
  'material.svgAssetsCache']);



// This is the router that the navbar uses 
// Add a controller for each route 
// The activetab assigns which tab is active, allowing us to add an .active class to the navbar button
app.config(function($routeProvider) {
      $routeProvider
      .when("/next_action", {
        templateUrl: 'next_action', 
        controller: '', 
        controllerAs: 'vm',
        activetab: "next_action"
      })
      .when("/SelectCallAccount", {
      	templateUrl: 'SelectCallAccount', 
      	controller: 'ListController', 
        controllerAs: 'vm',
      	activetab: "SelectCallAccount"
      })
      .when('/profile_settings/', {
        templateUrl: 'profile_settings',
        controller: 'ProfileSettingsController',
        controllerAs: 'vm', 
        activetab: 'profile_settings'
      })
      .when('/my_opportunities/', {
        templateUrl: 'my_opportunities',
        controller: 'OpportunitiesController',
        controllerAs: 'vm', 
        activetab: 'my_opportunities'
      })
      .when('/leads/:lead', {
        templateUrl: 'leads',
        controller: 'LeadsController',
        controllerAs: 'vm', 
        activetab: 'my_opportunities'
      });
	// $locationProvider.html5Mode(true);
}).run(function ($rootScope, $route) {
    $rootScope.$route = $route;
});


// This directive enables a <button> to use routing
app.directive('goClick', function ( $location ) {
  return function ( scope, element, attrs ) {
    var path;

    attrs.$observe('goClick', function (val) {
      path = val;
    });

    element.bind( 'click', function () {
      scope.$apply( function () {
        $location.path( path );
      });
    });
  };
});

// This sets the theme for the xeditable to work
app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; 
});