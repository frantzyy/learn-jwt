# learn-jwt

A project for learning JWT's through tutorials, blogs, and my own fumblings.

## Tutorials

Egghead.io by Kent Dodds
[https://egghead.io/series/angularjs-authentication-with-jwt](https://egghead.io/series/angularjs-authentication-with-jwt)

Thinkster.io by Matt Green
[https://thinkster.io/angularjs-jwt-auth](https://thinkster.io/angularjs-jwt-auth)

## JWT Resources

JWT Viewer and lots information about JWTs including packages to sign based on languages
 - [http://jwt.io/http://jwt.io/](http://jwt.io/http://jwt.io/)

Spec - RFC7519
 - [https://tools.ietf.org/html/rfc7519](https://tools.ietf.org/html/rfc7519)

Scotch.io - Get to JWT
 - [https://scotch.io/tutorials/the-anatomy-of-a-json-web-token](https://scotch.io/tutorials/the-anatomy-of-a-json-web-token)

Developer - JWT breakdown and example
- http://www.toptal.com/web/cookie-free-authentication-with-json-web-tokens-an-example-in-laravel-and-angularjs

## Basics

JWT consist of three main components:
 - header object
 - claims object
 	- this contains and expiration as well as other data such as userid, email etc...
 - signature

The three components are encoded using base64 and concatenated seperated by a period.

The token is not encrypted, so anyone can see the data. Check out this [JWT viewer](http://jwt.io/)

The token is signed by the server and will be rejected if values have changed.
