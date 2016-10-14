angular.module('JustDecide').controller("QuickController",function($scope, $state, $ionicHistory, $localStorage, $ionicPopup){

  //BEGIN Controller
  $scope.initQuick = function(){
  $scope.formData = {}
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
    //returns a random number from 0(inclusive) to 1 (exclusive)
    var rand = Math.random();
    var message = ""

    var runCoinFlip = function(rand){
      if (rand < .5){
        message = "Heads"
      } else{
        message = "Tails"
      }
      $scope.showDecision('The result of the flip is...', message)
    }

    var runRPS = function(rand){
      if (rand < .333){
        message = "Rock"
      } else if (rand < .666){
        message = "Paper"
      } else{
        message = "Scissors"
      }
      $scope.showDecision('Rock, paper, scissors shoot...', message)
    }

    var runDieRoll = function(rand){
      message = Math.floor(rand * 6) + 1
      $scope.showDecision('The result of the roll is...', message)
    }

    if ($scope.formData.coinFlip){
      runCoinFlip(rand)
    }
    else if ($scope.formData.RPS){
      runRPS(rand)
    } else if ($scope.formData.dieRoll){
      runDieRoll(rand)
    }
  }

  $scope.randPicker = function(numberPicks,min,max,replace){
    console.log(numberPicks,min,max,replace)

    if ( isNaN(numberPicks) || isNaN(min) || isNaN(max) || numberPicks == null || min == null || max == null){
      //error as one is not a number
    } else {
      numberPicks = Math.round(numberPicks)
      min = Math.round(min)
      max = Math.round(max)

      if (replace == undefined){
        replace = false
      }

      if(min >= max){
        //error, max must be greater than min
      } else if ( !replace && ((max-min+1) < numberPicks)){
        //error, trying to select more numbers than contained in range
      } else{
        //construct an array of possible values
        var arrayRange = []
        for (i = min; i <= max; i++){
          arrayRange.push(i)
        }
        var arrayPicks = []
        var upperIndexBound = arrayRange.length - 1

        for (i=0; i < numberPicks; i++){
          //picks a random integer between 0 and upperBound
          var rand = Math.floor(Math.random()*(upperIndexBound+1));
          if (arrayPicks == []){
            arrayPicks.push(arrayRange[rand])
          } else{
            arrayPicks.push(" "+arrayRange[rand])
          }
          //now pick numbers, while picks < number: generate ranomd number between 0 and array.length, get the value at this array index, then if replace is off delete that element of the array
          if (!replace){
            arrayRange.splice(rand, 1)
            upperIndexBound --
          }
        }
        message = arrayPicks
        $scope.showDecision('The result of the selection is...', message)
      }
    }
  }
}); //END Controller