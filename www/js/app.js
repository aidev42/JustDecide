// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngStorage'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("home", {
      "url": "/home",
      "templateUrl": "templates/home.html",
      "controller": "MainController",
      "cache": false
    })
    .state("edit", {
      "url": "/edit",
      "templateUrl": "templates/edit.html",
      "controller": "MainController",
      "cache": false
    })
    .state("quick", {
      "url": "/quick",
      "templateUrl": "templates/quick.html",
      "controller": "MainController",
      "cache": false
    })
    .state("settings", {
      "url": "/settings",
      "templateUrl": "templates/settings.html",
      "controller": "MainController",
      "cache": false
    });

  $urlRouterProvider.otherwise("home");
})

.controller("MainController",function($scope, $state, $ionicHistory, $localStorage){



  //When creating a new decision, set the workingDecision to blank, and navigate to edit page
  $scope.createDecision = function(){
    $localStorage.workingDecision = {
      title: "Testing",
      choices:{
        "choice 1 is a really long choice name what happens now when this is really long text does it cut off or does it expand the entire row who knows": 50,
        "choice 2": 30,
        "choice 3": 20
      }
    }
    $state.go("edit")
  }

  $scope.onProbChange = function(){
    var $probabilities = angular.element(document.getElementsByClassName('probability'));
    var sum = 0;
    for (i=$probabilities.length-1; i >= 0; i--){
      sum += parseInt($probabilities[i].value)
    };
    $scope.workingDecision.totalSum = sum
  }

  $scope.initEdit = function(){
    $scope.workingDecision = $localStorage.workingDecision
  }

  var testItem = {
    title: "this is a much longer test name"
  }

    var testItem2 = {
    title: "what to get for lunch"
  }

  $scope.init = function(){
    $scope.Favorites ={}
    $scope.Decisions ={}
    $scope.Decisions["test3"] = testItem
    $scope.Decisions["test4"] = testItem
    $scope.Decisions["test5"] = testItem
    $scope.Decisions["test6"] = testItem
    $scope.Decisions["test7"] = testItem
    $scope.Decisions["test8"] = testItem
    $scope.Decisions["test9"] = testItem
    $scope.Decisions["test10"] = testItem
    $scope.Decisions["test11"] = testItem
    $scope.Decisions["test11"] = testItem
    $scope.Favorites["test2"] = testItem2
    $scope.Favorites["ZZZ"] = {title:"test1"}
    $scope.Favorites["AAA"] = {title:"testA"}
  }

  $scope.unfavorite = function(key){
    //Move the key out of Favorites array and into Decisions array
    var item = $scope.Favorites[key];
    delete $scope.Favorites[key]
    $scope.Decisions[key] = item
  }

    $scope.favorite = function(key){
    //Move the key out of Decisions array and into favorites array
    var item = $scope.Decisions[key];
    delete $scope.Decisions[key]
    $scope.Favorites[key] = item
  }

  $scope.delete = function(key){
    delete $scope.Decisions[key]
    delete $scope.Favorites[key]
  }

  $scope.back = function() {
    $ionicHistory.goBack();
  }

  //for reorder we have the key, so placesave that, then begin recontructing the object until we reach the key tallymarker matching the fromIndex, insert the placeholder, and continue reconstruction

})