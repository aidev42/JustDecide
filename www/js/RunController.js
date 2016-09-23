angular.module('JustDecide').controller("RunController",function($scope, $state, $ionicHistory, $localStorage, $ionicPopup){

//TO DO:

// SPLIT QUICK CONTROLLER OUT TO ITS OWN FILE

// 1) build a coin flip function
// 2) build a die/number picker function
// 3) build a RPS picks function
// 4) try adding modal animation when pulling up edit from run
// 5) style page (button margin, table left-right margins)

//Next version: Add a blockout time function that stores last time of decision, and compares to current time (from API) and does not let you rerun

//This controller handles the running logic for custom decisions and quick decisions page

//BEGIN Controller
$scope.initRun = function(){
  $scope.workingDecision = $localStorage.workingDecision
  $scope.formData = {}
}
$scope.back = function() {
  $localStorage.workingDecision = {}
  $ionicHistory.goBack();
}

$scope.edit = function(){
  $localStorage.fromRun = true
  $state.go('edit')
}

$scope.showDecision = function(title,message) {
 var alertPopup = $ionicPopup.alert({
   title: title,
   template: message
 });
  alertPopup.then(function(res) {
    $scope.currentDate = new Date();
    console.log($scope.currentDate)
    //res is 'true', this fires after 'OK' button is clicked
  });
}

$scope.coinFlipToggle = function(){
  $scope.formData.RPS = false
  $scope.formData.dieRoll = false
}

$scope.RPSToggle = function(){
  $scope.formData.coinFlip = false
  $scope.formData.dieRoll = false
}

$scope.dieRollToggle = function(){
  $scope.formData.RPS = false
  $scope.formData.coinFlip = false
}

$scope.runQuickItem = function(){
  //first find which item to pick and run one of the three functions, then based on result of that function, create a popUp
}

$scope.decide = function(){
  //returns a random number from 0(inclusive) to 1 (exclusive)
  var rand = Math.random();
  //we need 0 to be exclusive but don't mind if 1 is inclusive, so take the inverse of this
  rand = 1 - rand
  var arrayCumulative = [] //will be an array of [key,upperbound cumulative prob]
  var cumulative = 0
  for (var key in $localStorage.workingDecision.choices){
    if ($localStorage.workingDecision.choices[key] > 0){
      cumulative += $localStorage.workingDecision.choices[key]
      arrayCumulative.push([key,cumulative])
    }
  }
  //Take rand * total prob which gives us a number >0 and <= to totalprob
  rand = rand * cumulative
  //The first element we find in the array whose upperbound is >= rand must contain rand, since the previous element's value by definition was < (not >=) to rand
  for (i=0; i < arrayCumulative.length; i++){
    console.log(arrayCumulative[i])
    if (arrayCumulative[i][1] >= rand){
      console.log('this is the winner: ', arrayCumulative[i])
      break
    }
  }

  $scope.showDecision('The choice is...', arrayCumulative[i][0])

  //fire popup for arrayCumulative[i]
}

}); //END Controller