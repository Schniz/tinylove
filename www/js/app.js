// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material', 'ionMdInput', 'ngCordova'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }


        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $sceDelegateProvider) {

    $sceDelegateProvider.resourceUrlWhitelist(['**']);
    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.record', {
        url: '/record',
        views: {
            'menuContent': {
                templateUrl: 'templates/record.html',
                controller: 'RecordCtrl'
            },
            'fabContent': {
                template: '<button ng-click="stopRecording()" id="fab-activity" class="button button-fab button-fab-bottom-right expanded button-energized-900 flap"><i class="icon ion-checkmark"></i></button>',
                controller: function($timeout, $scope) {
                    $scope.stopRecording = function() {
                        $scope.$$nextSibling.stopAudio(function(blob) {
                            console.log({ blob })
                        })
                    }
                    $timeout(function() {
                        document.getElementById('fab-activity').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })

    .state('app.friends', {
        url: '/friends',
        views: {
            'menuContent': {
                templateUrl: 'templates/friends.html',
                controller: 'FriendsCtrl'
            },
            'fabContent': {
                template: '<button id="fab-friends" class="button button-fab button-fab-top-left expanded button-energized-900 spin"><i class="icon ion-chatbubbles"></i></button>',
                controller: function($timeout) {
                    $timeout(function() {
                        document.getElementById('fab-friends').classList.toggle('on');
                    }, 900);
                }
            }
        }
    })

    .state('app.choose-card', {
        url: '/choose-card',
        views: {
            'menuContent': {
                templateUrl: 'templates/choose-card.html',
                controller: 'ChooseCardCtrl'
            },
            'fabContent': {
                template: '<button ui-sref="app.record" class="possibly-hidden-fab button button-fab button-fab-bottom-right expanded button-energized-900 read-now" ng-class="{hidden: !fab}"><i class="icon ion-android-book"></i></button>',
                controller: function($timeout, $scope) {
                    $scope.fab = false

                    window.kakikaki = $scope
                }
            }
        }
    })

    .state('app.finished', {
        url: '/finished',
        views: {
            'menuContent': {
                templateUrl: 'templates/finished.html',
                controller: 'FinishedCtrl'
            },
            'fabContent': {
                template: '<button ui-sref="app.gallery" id="fab-gallery" class="button button-fab button-fab-bottom-right expanded button-energized-900 drop read-now"><i class="icon ion-checkmark"></i></button>',
                controller: function($timeout, $scope) {
                    $timeout(function() {
                        document.getElementById('fab-gallery').classList.toggle('on');
                        // $scope.fab = false;

                    }, 600);
                }
            }
        }
    })

    .state('app.gallery', {
        url: '/gallery',
        views: {
            'menuContent': {
                templateUrl: 'templates/gallery.html',
                controller: 'GalleryCtrl'
            },
            'fabContent': {
                template: '<button ui-sref="app.choose-card" id="fab-gallery" class="button button-fab button-fab-bottom-right expanded button-energized-900 drop read-now"><i class="icon ion-android-book"></i></button>',
                controller: function($timeout, $scope) {
                    $timeout(function() {
                        document.getElementById('fab-gallery').classList.toggle('on');
                        // $scope.fab = false;

                    }, 600);
                }
            }
        }
    })

    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            },
            'fabContent': {
                template: '<button id="fab-profile" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus"></i></button>',
                controller: function($timeout) {
                    /*$timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);*/
                }
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/gallery');
});