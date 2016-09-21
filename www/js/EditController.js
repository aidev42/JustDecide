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
    calcTotalProb()
  }

  $scope.back = function() {
    $ionicHistory.goBack();
  }

  var calcTotalProb = function(){
    var sum = 0;
    for (var key in $localStorage.workingDecision.choices){
      sum += $localStorage.workingDecision.choices[key]
    }
    $scope.workingDecision.totalSum = sum
  }

  //Input validation functions
  var isNameInvalid = function(name){
    if (!name || name.length <= 0){
      console.log('name error')
      return true
    } else if ($scope.workingDecision.choices[name]){
        //note that this will fire if a change is made but not blurred until name is set back to what it was, it will see a duplicate when really there was no change to begin with
        console.log('key already exists')
        return true
    }
    else{
      return false
    }
  }

  var isProbInvalid = function(prob){
    if (prob > 99 || prob < 1 || isNaN(prob) || prob == null){
        console.log(parseInt(prob))
        console.log('number error')
        return true
    } else{
      return false
    }
  }

  //TO DO:
  // 6) write Evenprob function
  // 7) write resetProb function
  // 8) write - prob function
  // 9) write + prob function
  // 2ndL) write Save function
  // last) add error popups from validation

  //Input field change functions

    //When a name/key is about to be edited, save that name/key for reference once edit is finished
  $scope.nameChangeBegin = function(choiceName){
    console.log('name change begin wtih ', choiceName)
    $localStorage.workingDecision.workingChoice = choiceName
    console.log('storage is now', $localStorage.workingDecision.workingChoice)
  }
    //Once name/key edit is done, verify and then make the actual change
  $scope.nameChangeDone = function(choiceName){

    var oldName = $localStorage.workingDecision.workingChoice
    console.log('choice name after change is:', choiceName)

    //When no change is made to the name, $scope.formData.choiceName itself is undefined
    if ($scope.formData.choiceName == undefined){
      //Do nothing since nothing changed
    //Now check the changed name and if it is invalid set the original key back to original value
    } else if (isNameInvalid(choiceName)){
      $scope.formData.choiceName[oldName] = oldName
      console.log('name seen as invalid')
    } else{
      console.log('choice name is', choiceName)
      //If we've gotten here we want to change the old name to the new name
      var newName = choiceName
      //newName is now the updated name value (not existing key name), and oldName is the previous name value (existing key name)
      console.log('newName is: ', newName)


      //NOTE: Now we need to convert key-value pairs to indexed array so the keys themselves can be changed without reordering the key-value pairs. Key-values are used instead of arrays elsewhere due to the frequency of referencing values via key, which in an array would require a loop to locate each time

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

      //First convert to array, find location of old name entry in key array, update it, reconvert array into keys, and finally reconstruct the key-value pairs

      var array = keyToArray($localStorage.workingDecision.choices)

      //Now find the old key's location in array

      for (i=0; i < array.length; i++){
        if (array[i][0] == oldName){
          console.log('the array location was found')
          //i is the index of old key-value pair
          console.log('array old value is: ', array[i])
          console.log('new name is:', newName)
          array[i][0] = newName
          console.log('array new value is: ', array[i])

          break
        }
      }

      //We have to update the scope manually due to a bug without this line where the front end would retain old value linked to newkeyname when you changed a name back to a previous entered name (the ng-model's value was never updated for the previously entered name until now)
      $scope.formData.choiceName[newName] = newName
      //Now that array is ready, use it to reconstruct the key-value pairs
      $localStorage.workingDecision.choices = {}
      $localStorage.workingDecision.choices = arrayToKey(array)

      //This method is far simpler but messes up the ordering
      // delete $localStorage.workingDecision.choices[oldName]
      // $localStorage.workingDecision.choices[newName] = choiceProb

      console.log('storage workingChoice is now:', $localStorage.workingDecision.choices)
      console.log('SCOPE workingChoice is now:', $scope.workingDecision.choices)
    }
  }

  $scope.probChange = function(oldProb,newProb,key){
    //CHANGE THIS TO first take in the front end changed value, find the right key and update local storage, then go through local storage's keys values and sum them, not rely on data stored in view
    // console.log(choiceKey)
    console.log(newProb)

    if (isProbInvalid(newProb)){
      //Set it back to old
      $scope.formData.choiceProb[key] = oldProb
    } else{
      $scope.formData.choiceProb[key] = newProb
      $localStorage.workingDecision.choices[key] = newProb
      console.log('storage workingChoice is now:', $localStorage.workingDecision.choices)
      console.log('SCOPE workingChoice is now:', $scope.workingDecision.choices)
    }
    calcTotalProb()
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
    calcTotalProb()
  };

  $scope.deleteChoice = function(choiceName){
    delete $localStorage.workingDecision.choices[choiceName]
    calcTotalProb()
  }

  $scope.evenProb = function(){
    // keys(workingDecision.choices).length returns the total number of choices
    calcTotalProb()
  }

  $scope.Save = function(){
    //Must do input validation check on all probabilites, sum of probabilities and Decision Title. If workingDecision title/key already exists in storage, delete storage item and save new item under key. If not exists in storage, just save new item under key
  }

}); //END Controller