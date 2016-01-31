(function() {
    'user strict';
    var app = angular.module('app', [], function($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');

    });

    app.constant('API_BASE_URL', 'http://localhost:3000');

    // -----------------------
    // --- CONTROLLERS
    // -----------------------
    app.controller('MainCtrl', function MainCtrl(RandomUserFactory, UserFactory) {

        'user strict';
        var vm = this;
        vm.getRandomUser = getRandomUser;
        vm.login = login;
        vm.logout = logout;

        UserFactory.getUser().then(function success(response) {
            vm.user = response.data;
        });


        function getRandomUser() {
            RandomUserFactory.getUser().then(function success(response) {
                console.log(response.data);
                vm.randomUser = response.data;
            }, handleError);
        };

        function login(username, password) {
            console.log(username + " " + password);

            UserFactory.login(username, password).then(function success(response) {
                vm.user = response.data.user;
                //alert(response.data.token);
            }, handleError);
        };

        function logout() {
            console.log('logout');
            UserFactory.logout();
            vm.user = null;
        }

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

    app.factory('UserFactory', function UserFactory($http, API_BASE_URL, AuthTokenFactory) {
        'user strict';

        return {
            login: login,
            logout: logout,
            getUser: getUser
        };

        function login(username, password) {
            return $http.post(API_BASE_URL + '/login', {
                username: username,
                password: password
            }).then(function success(response) {
                AuthTokenFactory.setToken(response.data.token);
                return response;
            });
        };

        function logout() {
            AuthTokenFactory.setToken();
        };

        function getUser() {

            if (AuthTokenFactory.getToken()) {
                return $http.get(API_BASE_URL + '/me');
            } else {
                $q.reject({
                    data: 'client has no token'
                });
            }
        }
    });

    app.factory('AuthTokenFactory', function AuthTokenFactory($window) {
        'user strict';

        var store = $window.localStorage;
        var key = 'auth-token'

        return {
            getToken: getToken,
            setToken: setToken
        };

        function getToken() {
            return store.getItem(key);

        }

        function setToken(token) {

            if (token) {
                store.setItem(key, token);

            } else {
                store.removeItem(key);
            }


        }
    });


    app.factory('AuthInterceptor', function AuthInterceptor($window, AuthTokenFactory) {
        'user strict';

        var store = $window.localStorage;
        var key = 'auth-token'

        return {
            request: addToken

        };

        function addToken(config) {
            var token = AuthTokenFactory.getToken();
            if (token) {
                config.headers = config.headers || {};

                //OAuth 2.0 spec?? or just http headers spec?
                //http://oauth2.thephpleague.com/token-types/
                config.headers.Authorization = 'Bearer ' + token;
            }
            return config;

        }

    });
})();
