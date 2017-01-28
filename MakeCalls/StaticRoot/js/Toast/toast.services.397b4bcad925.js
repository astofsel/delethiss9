(function () {
  'use strict';

  angular
    .module('mainApp.toast.services')
    .factory('Toast', Toast);

  Toast.$inject = ['$mdToast'];

  function Toast($mdToast) {


    var Toast = {
    	showToast: showToast
    };

    return Toast;

    function showToast(message) {
			var last = {bottom: true, top: false, left: true, right: false};
			var toastPosition = angular.extend({},last);
			var getToastPosition = function(message) {
			return Object.keys(toastPosition)
				.filter(function(pos) {
					return toastPosition[pos];
				})
				.join(' ');
			};

			var appearToast = function(message) {
				var pinTo = getToastPosition();
				$mdToast.show(
					$mdToast.simple()
						.textContent(message)
						.position(pinTo)
						.hideDelay(3000)
				);
			}
			appearToast(message);	

    }




  }
}) ();

