'use strict';

var hackMeter = angular.module('hackMeter',[
    'btford.socket-io',
    'ngRoute'
])

.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'main.html',
            controller: 'MainController'
        })
        .when('/dash', {
            templateUrl: 'dash.html',
            controller: 'DashController'
        });
});

hackMeter.factory('mySocket', function (socketFactory) {
    return socketFactory({
        prefix: ''
    });
});

hackMeter.controller('MainController',
    function($scope,mySocket) {
        this.servoAngle = 30;
        this.tweetText = "No incoming tweets yet";
        var main = this;

        this.setAngle = function(angle) {
            var myAngle = parseInt(angle, 10);

            if (myAngle <= 180 && myAngle >= 0) {
                this.servoAngle = myAngle;
                mySocket.emit('setAngle',myAngle);
            }

        };

        this.setTweetTerm = function(term) {
            mySocket.emit('setTweetTerm', term);
        };

        this.setDecayInterval = function(interval) {
            var interval = parseInt(interval);
            mySocket.emit('setDecayInterval', interval);
        };

        mySocket.on('connected',function(data){
            $log.console('Working!')
        });

        mySocket.on('newTweet', function(data){
            main.tweetText = data.tweetText;
            main.servoAngle = data.servoAngle;
        });

    }
);

hackMeter.controller('DashController',
    function($scope, mySocket) {
        var dash = this;
        this.tweetText = "Waiting on Tweets";

        mySocket.on('newTweet', function(data){
            dash.tweetText = data.tweetText;
        });

    }
);