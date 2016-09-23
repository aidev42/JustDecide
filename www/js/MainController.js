angular.module('JustDecide').controller("MainController",function($scope, $state, $ionicHistory, $localStorage){

  //To do:
  // add popup confirmation before delete

  //Next version:
  //Add ability to drag and drop reorder (complication being it has to deal with going between two list headers)- we have the key, so placesave that, then begin recontructing the object until we reach the key tallymarker matching the fromIndex, insert the placeholder, and continue reconstruction

  //TEMPORARY FOR DEV- Generating test data
    //   var testItem2 = {
    //   title: "what to get for lunch"
    // }
    // var testItem = {
    //   title: "this is a much longer test name"
    // }
    // $localStorage.Favorites ={}
    // $localStorage.Decisions ={}
    // $localStorage.Decisions["test3"] = testItem
    // $localStorage.Decisions["test4"] = testItem
    // $localStorage.Decisions["test5"] = testItem
    // $localStorage.Decisions["test6"] = testItem
    // $localStorage.Decisions["test7"] = testItem
    // $localStorage.Decisions["test8"] = testItem
    // $localStorage.Decisions["test9"] = testItem
    // $localStorage.Decisions["test10"] = testItem
    // $localStorage.Decisions["test11"] = testItem
    // $localStorage.Decisions["test11"] = testItem
    // $localStorage.Favorites["ZZZ"] = {title:"test1"}
    // $localStorage.Favorites["AAA"] = {title:"testA"}

  // Tutorial Data to Load only on first use only
    if (!$localStorage.example){
      $localStorage.Favorites ={}
      $localStorage.Decisions ={}
      $localStorage.Favorites["Example: Lunch Order"] = {
        title: "Example: Lunch Order",
        workingTitle: self.title,
        choices:{
          "Sushi": 10,
          "Salad": 25,
          "Pizza": 10,
          "Chinese": 15,
          "Wrap": 20,
          "Greek": 20
        },
        workingChoice: ""
      }
      $localStorage.example = true
    }

  //BEGIN Controller
  $scope.initHome = function(){
    $scope.Favorites = $localStorage.Favorites
    $scope.Decisions = $localStorage.Decisions
    $localStorage.fromRun = false
  }

  //Creating a NEW decision: set workingDecision to blank and navigate to edit page
  $scope.createDecision = function(){
    $localStorage.workingDecision = {
      title: "",
      workingTitle: self.title,
      choices:{},
      workingChoice: ""
    }
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

  $scope.open = function(key){
    if ($localStorage.Favorites[key]){
      $localStorage.workingDecision = angular.copy($localStorage.Favorites[key])
    } else{
      $localStorage.workingDecision = angular.copy($localStorage.Decisions[key])
    }
    $state.go("run")

  }

  $scope.clearAll = function(){
    console.log($localStorage)
    $localStorage.Decisions = {}
    $localStorage.Favorites = {}
    $localStorage.example = false
    $localStorage.fromRun = false
    $localStorage.workingDecision = {}
  }

}); //END Controller