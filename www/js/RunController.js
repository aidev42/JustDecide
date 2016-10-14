angular.module('JustDecide').controller("RunController",function($scope, $state, $ionicHistory, $localStorage, $ionicPopup){

  //TO DO:
  // 1) try adding modal animation when pulling up edit from run

  //This controller handles the running logic for custom decisions and quick decisions page

  //BEGIN Controller
  $scope.initRun = function(){
    $scope.workingDecision = $localStorage.workingDecision
    $scope.formData = {}
    console.log($scope.workingDecision)
  }
  $scope.back = function() {
    $localStorage.workingDecision = {}
    $localStorage.fromRun = false
    $ionicHistory.goBack();
  }

  $scope.edit = function(){
    $localStorage.fromRun = true
    console.log('LOOK HERE the fromRun storage is now: ', $localStorage.fromRun)
    $state.go('edit')
  }

  $scope.showDecision = function(title,message) {
   var alertPopup = $ionicPopup.alert({
     title: title,
     template: message
   });
    alertPopup.then(function(res) {
      //res is 'true', this fires after 'OK' button is clicked
    });
  }

  $scope.decide = function(){

    // (new Date() - x) / (1000 * 60) = number of minutes elapsed since x
    console.log('this is lockout value:', $localStorage.lockout)
    console.log('this is last run value:', $localStorage.workingDecision.lastRunTime)

    //if lockout option is ON AND it has been less than 5 minutes elapsed fire popup
    if ($localStorage.lockout && ((new Date() - $localStorage.workingDecision.lastRunTime) / (1000 * 60) < 5)){
      // not enought time has passed
      $scope.showDecision('In lockout period, decision was...', $localStorage.workingDecision.lastDecision)
    } else {
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
      var now = new Date()

      //update working decision and updated saved values
      $localStorage.workingDecision.lastRunTime = now
      $localStorage.workingDecision.lastDecision = arrayCumulative[i][0]

      if ($localStorage.Favorites[$localStorage.workingDecision.title]){
        $localStorage.Favorites[$localStorage.workingDecision.title].lastRunTime = now
        $localStorage.Favorites[$localStorage.workingDecision.title].lastDecision = arrayCumulative[i][0]
        console.log($localStorage.Favorites[$localStorage.workingDecision.title])
      } else {
        $localStorage.Decisions[$localStorage.workingDecision.title].lastRunTime = now
        $localStorage.Decisions[$localStorage.workingDecision.title].lastDecision = arrayCumulative[i][0]
        console.log($localStorage.Decisions[$localStorage.workingDecision.title])
      }
      //Fire popup
      $scope.showDecision('The choice is...', arrayCumulative[i][0])
    }
  }

}); //END Controller