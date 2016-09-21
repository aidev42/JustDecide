angular.module('JustDecide').controller("EditController",function($scope, $state, $ionicHistory, $localStorage){

  //TEMPORARY FOR DEV- Generating test data
    $localStorage.workingDecision = {
      title: "Testing",
      choices:{
        "choice is a really long choice name what happens now when this is really long text does it cut off or does it expand the entire row who knows": 50,
        "choice two": 30,
        "choice three": 20
      }
    }

  //BEGIN Controller
  $scope.initEdit = function(){
    $scope.workingDecision = $localStorage.workingDecision
    $scope.formData = {};
    $scope.probChange()
  }

  $scope.back = function() {
    $ionicHistory.goBack();
  }

  //Input validation functions
  var isNameInvalid = function(name){
    if (!name || name.length <= 0){
      console.log('name error')
      return true
    } else if ($scope.workingDecision.choices[name]){
        console.log('key already exists')
        return true
    }
    else{
      return false
    }
  }

  var isProbInvalid = function(prob){
    if (prob > 99 || prob < 1 || isNaN(prob)){
        console.log(parseInt(prob))
        console.log('number error')
        return true
    } else{
      return false
    }
  }

  //TO DO:
  // 3) add delete function
  // 4) create nameChange function
  // 5) rewrite probChange function
  // 6) write Evenprob function
  // 7) write resetProb function
  // 8) write - prob function
  // 9) write + prob function
  // 2ndL) write Save function
  // last) add error popups from validation

  //Input field change functions
  $scope.nameChange = function(choiceName){

  }

  $scope.probChange = function(){
    //CHANGE THIS TO first take in the front end changed value, find the right key and update local storage, then go through local storage's keys values and sum them, not rely on data stored in view
    // console.log(choiceKey)

    var $probabilities = angular.element(document.getElementsByClassName('probability'));
    var sum = 0;
    for (i=$probabilities.length-1; i >= 0; i--){
      sum += parseInt($probabilities[i].value)
    };
    $scope.workingDecision.totalSum = sum
  }



  //Button click functions
  $scope.addChoice = function(choiceName,choiceProb){
    var intProb = parseInt(choiceProb)
    if (isNameInvalid(choiceName)){
      //fails check
    } else if (isProbInvalid(intProb)){
      //fails check
    } else{
      $localStorage.workingDecision.choices[choiceName] = intProb
      $scope.formData.newChoiceName = ""
      $scope.formData.newChoiceProb = ""
    }
  };


  $scope.Save = function(){
    //Must do input validation check on all probabilites, sum of probabilities and Decision Title. If workingDecision title/key already exists in storage, delete storage item and save new item under key. If not exists in storage, just save new item under key
  }

}); //END Controller