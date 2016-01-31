(function() {
	'user strict';
	var app = angular.module('app', []);

	app.constant('API_BASE_URL', 'http://localhost:3000');

	//CONTROLLER
	app.controller('MainCtrl', function MainCtrl(RandomUserFactory) {

		'user strict';
		var vm = this;
		vm.getRandomUser = getRandomUser;


		function getRandomUser() {
			console.log('click');

			RandomUserFactory.getUser().then(function success(response) {
				console.log(response.data);
				vm.randomUser = response.data;
			});
		};
	});

	//SERVICE
	app.factory('RandomUserFactory', function RandomUserFactory($http, API_BASE_URL) {
		'user strict';

		return {
			getUser: getUser
		};

		function getUser() {
			return $http.get(API_BASE_URL + '/random-user');
		}
	});
})();