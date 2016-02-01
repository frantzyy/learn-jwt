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
        vm.showToken = showToken;
        vm.user = null;
        vm.tokenDecoded = null;

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
            vm.tokenDecoded = null;
        };

        function handleError(response) {
            alert('Error: ' + response.data);
        };

        function showToken() {

            vm.tokenDecoded = UserFactory.getDecodedToken();

            // vm.tokenDecoded = JSON.stringify(UserFactory.getDecodedToken());
            console.log(vm.tokenDecoded);
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
        };
    });

    app.factory('UserFactory', function UserFactory($http, $q, API_BASE_URL, AuthTokenFactory) {
        'user strict';

        return {
            login: login,
            logout: logout,
            getUser: getUser,
            getDecodedToken: getDecodedToken
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
                    data: 'client has no auth token'
                });
            }
        };

        function getDecodedToken() {
            return AuthTokenFactory.decodeToken();
        };
    });

    app.factory('AuthTokenFactory', function AuthTokenFactory($window) {
        'user strict';

        var store = $window.localStorage;
        var key = 'auth-token'

        return {
            getToken: getToken,
            setToken: setToken,
            decodeToken: decodeToken
        };

        function getToken() {
            return store.getItem(key);

        };

        function setToken(token) {

            if (token) {
                store.setItem(key, token);

            } else {
                store.removeItem(key);
            }
        };

        function decodeToken() {

            //http://stackoverflow.com/questions/2820249/base64-encoding-and-decoding-in-client-side-javascript

            var token = getToken();
            if (!token) {
                alert('no token present to decode');

            }
            var jwtParts = token.split(".");
            console.log(jwtParts);

            var header = jwtParts[0];
            var headerDecoded = atob(header);
            console.log(headerDecoded);

            var claims = jwtParts[1];
            var claimsDecoded = atob(claims);
            console.log(claimsDecoded);

            //TODO
            //signarture needs to be decrypted... not really sure how I want to do that. 
            //check out source code here: https://jwt.io/

            return {
                'header': JSON.parse(headerDecoded),
                'claims': JSON.parse(claimsDecoded)
            }


        };

        function encodeToken() {
            //TODO
        };
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

                //is Bearer part of the OAuth 2.0 spec or something else?
                //http://oauth2.thephpleague.com/token-types/
                config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
        }
    });

})();
