angular.module('JustDecide').controller("EditController",function($scope, $state, $ionicHistory, $localStorage){

  //TEMPORARY FOR DEV- Generating test data
    $localStorage.workingDecision = {
      title: "Testing",
      choices:{
        "choice is a really long choice name what happens now when this is really long text does it cut off or does it expand the entire row who knows": 50,
        "choice two": 30,
        "choice three": 20
      },
      workingChoice: ""
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
  // 4) create nameChange function
  // 5) rewrite probChange function
  // 6) write Evenprob function
  // 7) write resetProb function
  // 8) write - prob function
  // 9) write + prob function
  // 2ndL) write Save function
  // last) add error popups from validation

  //Input field change functions

    //When a name/key is about to be edited, save that name/key for reference once edit is finished
  $scope.nameChangeBegin = function(choiceName){
    console.log('Name change has begun')
    console.log(choiceName)
    $localStorage.workingDecision.workingChoice = choiceName
    console.log($localStorage.workingDecision.workingChoice)
  }
    //Once name/key edit is done, verify and then make the actual change
  $scope.nameChangeDone = function(choiceName){
    //First, examine the changed name, if new name is invalid update the name field to the old value, if the new name is valid find the location of the old name entry in array of keys, remove old, splice new into old's location, and reconvert the array into keys and reconstuct the object. Also need to account for if no name change is made choiceName is undefined. Note this function will also need to be fed the choice's probability so that probability can do added with the key into the array

    //DO ALL VALIDATION HERE

    //Array converter is necessary to convert key-value pairs into an indexed array so key's themselves can be changed without shifting the ordering of key-value pairs. Key-values are used instead of arrays elsewhere due to the frequency of referencing values via key, which in an array would require a loop to locate each time
    var keyToArray = function(keys){
      var keyArray = [];
      for(var key in keys) { keyArray.push([ key, keys[key] ]); }
      return keyArray;
    }

    var arrayToKey = function(keyArray){
      var keys = {}
      for (i=0; i < keyArray.length; i++){
        keys[keyArray[i][0]] = keyArray[i][1]
      }
      return keys
    }

    //This converts keys into array
    var array = keyToArray($localStorage.workingDecision.choices)
    //Now find the old key's location in the array, remove it and add new one to array: $localStorage.workingDecision.workingChoice is the old key

    //Now that array is ready, use it to reconstruct the key-value pairs
    $localStorage.workingDecision.choices = {}
    $localStorage.workingDecision.choices = arrayToKey(array)
    //Done, the name has been successsfully changed
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

  $scope.deleteChoice = function(choiceName){
    delete $localStorage.workingDecision.choices[choiceName]
  }

  $scope.Save = function(){
    //Must do input validation check on all probabilites, sum of probabilities and Decision Title. If workingDecision title/key already exists in storage, delete storage item and save new item under key. If not exists in storage, just save new item under key
  }

}); //END Controller