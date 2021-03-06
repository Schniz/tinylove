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
    .controller('RecordCtrl', function($scope, $sce, $state, $rootScope, $stateParams, $cordovaVibration, $cordovaBluetoothSerial, $ionicPlatform, $timeout, ionicMaterialMotion, ionicMaterialInk) {
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
        $scope.$parent.setHeaderFab('right');

        var xys = [];
        var stopAudio = recordAudio(appendEventData(xys));
        $scope.stopAudio = function() {
            stopAudio(function(blob) {
                window.latestRecording = blob
                window.latestXys = xys
                console.log({ blob });
                // var audioFile = URL.createObjectURL(blob);
                // $scope.setAudioFile(audioFile);
                $scope.$apply()
                $state.go('app.finished')

            })
        }

        $scope.setAudioFile = function(af) {
            $scope.audioFile = af;
        }

        $timeout(function() {
            ionicMaterialMotion.fadeSlideIn({
                selector: '.animate-fade-slide-in .item'
            });
        }, 200);



        // Activate ink for controller
        ionicMaterialInk.displayEffect();

        $scope.tryConnect = function() {
            $cordovaBluetoothSerial.discoverUnpaired().then(function(found) {

                    $scope.devices = found;
                    var device = $scope.devices.find(function(item) {
                        return item.name === "eSpinner";
                    })

                    $scope.conn = $cordovaBluetoothSerial.connect(device.address).subscribe(
                        function(x) {
                            alert('connected!');

                            // start recording
                        });
                },
                function() {
                    setTimeout($scope.tryConnect, 500);
                });
        }

        $ionicPlatform.ready(function() {
            try {
                $cordovaBluetoothSerial.enable().then(function(found) {
                        $scope.stat = "enabled";
                        $cordovaBluetoothSerial.isEnabled().then(function(found) {
                                $scope.stat = "isEnabled";
                                $cordovaBluetoothSerial.discoverUnpaired().then(function(found) {
                                        $scope.stat = "found";
                                        $scope.devices = found;
                                        var device = $scope.devices.find(function(item) {
                                            return item.name === "eSpinner";
                                        })
                                        $scope.stat = device.address;
                                        $scope.conn = $cordovaBluetoothSerial.connect(device.address).subscribe(
                                            function(x) {
                                                $scope.stat = "connected!";

                                                // start recording
                                            });
                                    },
                                    function() {
                                        $scope.stat = "nothing found";
                                        setTimeout($scope.tryConnect, 500);
                                    });
                            },
                            function() {
                                $scope.stat = "not enabled";
                            });
                    },
                    function() {
                        $scope.stat = "cant enable";
                    });

            } catch (err) {
                $scope.stat = "error: " + err;
            }
        });


        $scope.lightUp = function() {
            $cordovaVibration.vibrate(1000);
            setTimeout(function() {
                $cordovaVibration.vibrate(2000);
            }, 1000);

            $cordovaBluetoothSerial.write('g', function() {
                console.log("boom");
            }, function(err) {
                console.log("no boom " + err);
            });
        }


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
        $rootScope.stories = [{
                title: "The best story ever",
                likes: 4,
                comments: 5,
                recording: {},
                cards: [1, 2, 3, 4, 5, 0],
                date: new Date(),
                user: {
                    name: "Gal Shlezinger",
                    img: "img/gal.jpg"
                },
                audio: "fixtures/sound1.mp4"
            },
            {
                title: "An even better STORY!",
                likes: 4,
                comments: 5,
                recording: {},
                cards: [1, 2, 3, 4, 5, 0],
                date: new Date(),
                user: {
                    name: "Gal Shlezinger",
                    img: "img/gal.jpg"
                },
                audio: "fixtures/sound2.mp4"
            }
        ]




        $rootScope.stories.forEach(function(post) {
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

.controller('FinishedCtrl', function($scope, $rootScope, $ionicPlatform, $stateParams, $cordovaDeviceMotion, $cordovaVibration, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    var canvas = drawCanvasOfValues(document.body.clientWidth, 300, window.latestXys || [0, 1, 0, 1])
    $timeout(function() {
        console.log(canvas)
        document.getElementById('canvas-placeholder').appendChild(canvas)
    }, 100)

    $scope.emotions = [
        { id: 'like', img: 'http://i.imgur.com/LwCYmcM.gif' },
        { id: 'love', img: 'http://i.imgur.com/k5jMsaH.gif' },
        { id: 'haha', img: 'http://i.imgur.com/f93vCxM.gif' },
        { id: 'yay', img: 'http://i.imgur.com/a44ke8c.gif' },
        { id: 'wow', img: 'http://i.imgur.com/9xTkN93.gif' },
        { id: 'sad', img: 'http://i.imgur.com/tFOrN5d.gif' },
        { id: 'angry', img: 'http://i.imgur.com/1MgcQg0.gif' }
    ]

    $scope.audioFile = URL.createObjectURL(latestRecording);



    // $scope.share = function() {
    $rootScope.stories.push({
        title: $scope.title,
        likes: 0,
        comments: 0,
        recording: {},
        cards: [1, 2, 3, 4, 5, 0],
        date: new Date(),
        user: {
            name: "Gal Shlezinger",
            img: "img/gal.jpg"
        },
        audio: $scope.audioFile
    });
    // }

    $scope.select = function(e) {
        $scope.emotions = $scope.emotions.map(function(emotion) {
            emotion.selected = e === emotion
            return emotion
        })
    }
})

;