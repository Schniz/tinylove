/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
})

.controller('LoginCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk) {
    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();
})

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ActivityCtrl', function($scope, $rootScope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
        $scope.$parent.setHeaderFab('right');

        $timeout(function() {
            ionicMaterialMotion.fadeSlideIn({
                selector: '.animate-fade-slide-in .item'
            });
        }, 200);

        // Activate ink for controller
        ionicMaterialInk.displayEffect();
    })
    .controller('RecordCtrl', function($scope, $rootScope, $stateParams, $cordovaBluetoothSerial, $ionicPlatform, $timeout, ionicMaterialMotion, ionicMaterialInk) {
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
        $scope.$parent.setHeaderFab('right');

        $timeout(function() {
            ionicMaterialMotion.fadeSlideIn({
                selector: '.animate-fade-slide-in .item'
            });
        }, 200);



        // Activate ink for controller
        ionicMaterialInk.displayEffect();


        $ionicPlatform.ready(function() {
            $cordovaBluetoothSerial.enable().then(function(found) {
                    $cordovaBluetoothSerial.isEnabled().then(function(found) {
                            $cordovaBluetoothSerial.discoverUnpaired().then(function(found) {

                                    $scope.devices = found;
                                    var device = $scope.devices.find(function(item) {
                                        return item.name === "eSpinner";
                                    })

                                    $scope.conn = $cordovaBluetoothSerial.connect(device.address).subscribe(
                                        function(x) {
                                            alert('connected!');
                                        });
                                },
                                function() {
                                    alert('not found devices')
                                });
                        },
                        function() {
                            alert('not enabled');
                        });
                },
                function() {
                    alert('error enabling');
                });


        });





    })
    .controller('GalleryCtrl', function($scope, $rootScope, $ionicPlatform, $stateParams, $cordovaDeviceMotion, $cordovaVibration, $timeout, ionicMaterialInk, ionicMaterialMotion) {
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
        $scope.$parent.setHeaderFab(false);

        ionicMaterialInk.displayEffect();

        ionicMaterialMotion.pushDown({
            selector: '.push-down'
        });
        // ionicMaterialMotion.fadeSlideInRight({
        //     selector: '.animate-fade-slide-in .item'
        // });

        $rootScope.cards = [{
                id: 0,
                img: "img/0.png"
            }, {
                id: 1,
                img: "img/1.png"
            },
            {
                id: 2,
                img: "img/2.png"
            },
            {
                id: 3,
                img: "img/3.png"
            },
            {
                id: 4,
                img: "img/4.png"
            },
            {
                id: 5,
                img: "img/5.png"
            },
            {
                id: 6,
                img: "img/6.png"
            },
            {
                id: 7,
                img: "img/7.png"
            },
            {
                id: 8,
                img: "img/8.png"
            }
        ]

        $scope.idToCard = function(id) {
            return $rootScope.cards.find(function(element) {
                return element.id == id;
            })
        }

        var date = Date.now();
        $scope.stories = [{
                title: "The best story ever",
                likes: 4,
                comments: 5,
                recording: {},
                cards: [1, 2, 3, 4, 5, 0],
                date: new Date(),
                user: {
                    name: "Daenerys Targerian",
                    img: "img/daenerys.jpg"
                },
                audio: "/fixtures/sound1.mp4"
            },
            {
                title: "asd",
                likes: 4,
                comments: 5,
                recording: {},
                cards: [1, 2, 3, 4, 5, 6],
                date: new Date(),
                user: {
                    name: "Daenerys Targerian",
                    img: "img/daenerys.jpg"
                },
                audio: "/fixtures/sound2.mp4"
            }
        ]




        $scope.stories.forEach(function(post) {
            post.cards = post.cards.map(function(card) {
                return $scope.idToCard(card);
            })
        })

    })

.controller('ChooseCardCtrl', function($scope, $rootScope, $ionicPlatform, $stateParams, $cordovaDeviceMotion, $cordovaVibration, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    window.kakipipi = $scope

    function setFab(val) {
        $scope.$$prevSibling.fab = val
    }

    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });

    $scope.cards = [{
            id: 0,
            img: "img/0.png"
        }, {
            id: 1,
            img: "img/1.png"
        },
        {
            id: 2,
            img: "img/2.png"
        },
        {
            id: 3,
            img: "img/3.png"
        },
        {
            id: 4,
            img: "img/4.png"
        },
        {
            id: 5,
            img: "img/5.png"
        },
        {
            id: 6,
            img: "img/6.png"
        },
        {
            id: 7,
            img: "img/7.png"
        },
        {
            id: 8,
            img: "img/8.png"
        }
    ]

    $scope.firstPileOfCards = []
    $scope.secondPileOfCards = []
    $scope.amountOfCardsRemaining = function() {
        return 6 - $scope.firstPileOfCards.filter(function(e) { return e.selected }).length - $scope.secondPileOfCards.filter(function(e) { return e.selected }).length;
    }
    $scope.selected = function(card) {
        var newValue = !card.selected;
        var amountOfCardsRemaining = $scope.amountOfCardsRemaining()
        var alreadySix = amountOfCardsRemaining <= 0;
        if (newValue && alreadySix) return;
        card.selected = newValue;
        setFab($scope.amountOfCardsRemaining() === 0)
    }

    $scope.cards.forEach(function(card, i) {
        (i % 2 === 1 ? $scope.firstPileOfCards : $scope.secondPileOfCards).push({
            id: card.id,
            img: card.img,
            selected: false
        })
    })

    $scope.kaki = "gal"
})

;