angular.module('JustDecide').controller("HomeController",function($scope, $state, $ionicHistory, $localStorage){

  //TEMPORARY FOR DEV- Generating test data
    var testItem = {
      title: "this is a much longer test name"
    }
      var testItem2 = {
      title: "what to get for lunch"
    }

    $localStorage.Favorites ={}
    $localStorage.Decisions ={}
    $localStorage.Decisions["test3"] = testItem
    $localStorage.Decisions["test4"] = testItem
    $localStorage.Decisions["test5"] = testItem
    $localStorage.Decisions["test6"] = testItem
    $localStorage.Decisions["test7"] = testItem
    $localStorage.Decisions["test8"] = testItem
    $localStorage.Decisions["test9"] = testItem
    $localStorage.Decisions["test10"] = testItem
    $localStorage.Decisions["test11"] = testItem
    $localStorage.Decisions["test11"] = testItem
    $localStorage.Favorites["test2"] = testItem2
    $localStorage.Favorites["ZZZ"] = {title:"test1"}
    $localStorage.Favorites["AAA"] = {title:"testA"}

  //BEGIN Controller
  $scope.initHome = function(){
    $scope.Favorites = $localStorage.Favorites
    $scope.Decisions = $localStorage.Decisions
  }

  //Creating a NEW decision: set workingDecision to blank and navigate to edit page
  $scope.createDecision = function(){
    $localStorage.workingDecision = {}
    $state.go("edit")
  }

  $scope.favorite = function(key){
    //Move the item out of Decisions and into Favorites
    var item = $localStorage.Decisions[key];
    delete $localStorage.Decisions[key]
    $localStorage.Favorites[key] = item
  }

  $scope.unfavorite = function(key){
    //Move the item out of Favorites and into Decisions
    var item = $localStorage.Favorites[key];
    delete $localStorage.Favorites[key]
    $localStorage.Decisions[key] = item
  }

  $scope.delete = function(key){
    delete $localStorage.Decisions[key]
    delete $localStorage.Favorites[key]
  }

  //Next version:
  //1) Add ability to drag and drop reorder (complication being it has to deal with going between two list headers)- we have the key, so placesave that, then begin recontructing the object until we reach the key tallymarker matching the fromIndex, insert the placeholder, and continue reconstruction

}); //END Controller