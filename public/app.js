(function() {
    'user strict';
    var app = angular.module('app', []);

    app.constant('API_BASE_URL', 'http://localhost:3000');

    // -----------------------
    // --- CONTROLLERS
    // -----------------------
    app.controller('MainCtrl', function MainCtrl(RandomUserFactory, UserFactory) {

        'user strict';
        var vm = this;
        vm.getRandomUser = getRandomUser;
        vm.login = login;


        function getRandomUser() {
            RandomUserFactory.getUser().then(function success(response) {
                console.log(response.data);
                vm.randomUser = response.data;
            }, handleError);
        };

        function login(username, password) {
            console.log(username + " " + password);
            UserFactory.login(username, password).then(function success(response) {
                vm.user = response.data;
            }, handleError);
        };

        function handleError(response) {
            alert('Error: ' + response.data);
        };
    });

    // -----------------------
    // --- SERVICES
    // -----------------------

    app.factory('RandomUserFactory', function RandomUserFactory($http, API_BASE_URL) {
        'user strict';

        return {
            getUser: getUser
        };

        function getUser() {
            return $http.get(API_BASE_URL + '/random-user');
        }
    });

    app.factory('UserFactory', function UserFactory($http, API_BASE_URL) {
        'user strict';

        return {
            login: login
        };

        function login(username, password) {
            return $http.post(API_BASE_URL + '/login', {
                username: username,
                password: password
            });
        }
    });
})();
