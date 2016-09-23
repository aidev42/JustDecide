angular.module('JustDecide').controller("EditController",function($scope, $state, $ionicHistory, $localStorage){

  //TO DO:
  // 9) minus and prob functions dont have bounds the number being increased by the counter, also make sure to clean the numbers to 1 decimal each thing is added to (4 new numbers in each function). Also change +/- behaivor such that if the total is <100 or >100, only the clicked field updates if in right direction, and nothing updates if in wrong direction
  // last) add error popups from validation, and confirmation popup when deleting a choice

  //TEMPORARY FOR DEV- Generating test data
    // $localStorage.workingDecision = {
    //   title: "",
    //   workingTitle: self.title,
    //   choices:{
    //     "choice is a really long choice name what happens now when this is really long text does it cut off or does it expand the entire row who knows": 50,
    //     "choice two": 30,
    //     "choice three": 20
    //   },
    //   workingChoice: ""
    // }

  //BEGIN Controller
  $scope.initEdit = function(){
    $scope.workingDecision = $localStorage.workingDecision
    $scope.formData = {}
    calcTotalProb()
  }

  $scope.back = function() {
    if (!$localStorage.fromRun){
      $localStorage.workingDecision = {}
    }
    $localStorage.fromRun = false
    $ionicHistory.goBack();
  }

  var calcTotalProb = function(){
    var sum = 0;
    for (var key in $localStorage.workingDecision.choices){
      sum += $localStorage.workingDecision.choices[key]
    }
    $scope.workingDecision.totalSum = cleanProb(sum,0)
  }

  var cleanProb = function(prob,precision){
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(prob * multiplier) / multiplier;
  }

  //Input validation functions
  var isTitleInvalid = function(title){
    if ((title == undefined) && $scope.workingDecision.title.length > 0){
      //Title is an existing title that has not changed, so it is valid
      $scope.workingDecision.workingTitle = $scope.workingDecision.title
      return false
    } else if (!title || title.length <= 0){
      console.log('title error')
      return true
    } else if ($scope.workingDecision.title != $scope.workingDecision.workingTitle){
      //Title has been changed, ie. is trying to save a new value so check if new value is original
      if ($localStorage.Decisions[$scope.workingDecision.workingTitle] || $localStorage.Favorites[$scope.workingDecision.workingTitle]){
        console.log('duplicate title')
        return true
      }
    } else{
      return false
    }
  }

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
    if (prob > 100 || prob < 0 || isNaN(prob) || prob == null){
        console.log(prob)
        console.log('number error')
        return true
    } else{
      return false
    }
  }

  //Input field change functions

  $scope.titleChange = function(){
    if ($scope.formData.decisionTitle == undefined){
      //do nothing
    } else {
      $localStorage.workingDecision.workingTitle = $scope.formData.decisionTitle
      console.log('the working title is now: ', $localStorage.workingDecision.workingTitle)
      console.log('scope working title is now: ', $scope.workingDecision.workingTitle)
    }
  }

  //When a name/key is about to be edited, save that name/key for reference once edit is finished
  //Button toggle is needed to ensure certain functions which run on (key) do not run when a name is being changed, ie they can only run after a name has fully changed and key values have been updated
  var buttonToggle = true
  $scope.nameChangeBegin = function(choiceName){
    buttonToggle = false
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
      console.log('old name being deleted is: ', $scope.formData.choiceName[oldName])
      delete $scope.formData.choiceName[oldName]
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
    buttonToggle = true
  }

  $scope.probChange = function(oldProb,newProb,key){
   //When no change is made, $scope.formData.choiceProb (saved as newProb) itself is undefined
      console.log($scope.formData)

   if ($scope.formData.choiceProb == undefined){
      //Do nothing since nothing changed
    } else{
      var newProb = cleanProb(newProb,1)

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
  }

  //Button click functions
  $scope.addChoice = function(choiceName,choiceProb){
    console.log('before adding choice: ', $localStorage.workingDecision.choices)
    var newProb = cleanProb(choiceProb,1)
    if (isNameInvalid(choiceName)){
      //fails check
    } else if (isProbInvalid(newProb)){
      //fails check
    } else{
      $localStorage.workingDecision.choices[choiceName] = newProb
      $scope.formData.newChoiceName = ""
      $scope.formData.newChoiceProb = ""
    }
    calcTotalProb()
    console.log('after adding choice: ', $localStorage.workingDecision.choices)
  };

  $scope.deleteChoice = function(choiceName){
    if (buttonToggle){
      delete $localStorage.workingDecision.choices[choiceName]
      calcTotalProb()
    }
  }

  $scope.evenProb = function(){

    var counter = 0
    for (var key in $localStorage.workingDecision.choices){
      counter += 1
    }
    var prob = cleanProb(100 / counter,1)
    //Assign prob to each key
    for (var key in $localStorage.workingDecision.choices){
      $scope.workingDecision.choices[key] = prob
      //The changes do not save down to the actual ng-model values, likely do to a scoping issue. Using $parent in various applications yielded no results, so resorting to jQuery manual overrides of the fields
      var $probs = angular.element(document.getElementsByClassName('probability'));
      var sum = 0
        for (i=0; i < $probs.length; i++){
          $probs[i].value = prob
        }
    }
    console.log('ON EVEN PROB this is what is in favs: ', $localStorage.Favorites[$localStorage.workingDecision.title])
    calcTotalProb()
  }

  $scope.resetProb = function(){
    for (var key in $localStorage.workingDecision.choices){
      $localStorage.workingDecision.choices[key] = 0
      //The changes do not save down to the actual ng-model values, likely do to a scoping issue. Using $parent in various applications yielded no results, so resorting to jQuery manual overrides of the fields
      var $probs = angular.element(document.getElementsByClassName('probability'));
        for (i=0; i < $probs.length; i++){
          $probs[i].value = 0
        }
    }
    calcTotalProb()
  }

  $scope.minusProb = function(minusKey,formData){
    console.log('form data in minus prob: ', formData)
    var counter = 0
    var clickedPos = 0
    var keyNum = 0
    if (buttonToggle){
      console.log('this key clicked for minus: ', minusKey)
      for (var key in $localStorage.workingDecision.choices){
        if (minusKey == key){
          clickedPos = keyNum
        } else if (isProbInvalid($localStorage.workingDecision.choices[key]+1)){
          //Can't make change so don't add to counter
        } else {
          counter += 1
          console.log('this key made counter increase: ', key)
        }
        keyNum ++
      }
      console.log('the minus counter is :', counter)
      //Now we have counter of how many items can be decreased, which is how much existing key will be increased
      $probs = angular.element(document.getElementsByClassName('probability'))
      var keyNum = 0
      for (var key in $localStorage.workingDecision.choices){
        if (minusKey == key){
          $probs[clickedPos].value =  Number($probs[clickedPos].value) - counter
          $localStorage.workingDecision.choices[key] -= counter
        } else if (!(isProbInvalid($localStorage.workingDecision.choices[key]+1))){
          $probs[keyNum].value ++
          $localStorage.workingDecision.choices[key] ++
        }
        keyNum ++
      }
    }
  }

  $scope.plusProb = function(plusKey){
    var counter = 0
    var clickedPos = 0
    var keyNum = 0
    if (buttonToggle){
      console.log('this key clicked for minus: ', plusKey)
      for (var key in $localStorage.workingDecision.choices){
        if (plusKey == key){
          clickedPos = keyNum
        } else if (isProbInvalid($localStorage.workingDecision.choices[key]-1)){
          //Can't make change so don't add to counter
        } else {
          counter += 1
          console.log('this key made counter increase: ', key)
        }
        keyNum ++
      }
      console.log('the plus counter is :', counter)
      //Now we have counter of how many items can be decreased, which is how much existing key will be increased
      $probs = angular.element(document.getElementsByClassName('probability'))
      var keyNum = 0
      for (var key in $localStorage.workingDecision.choices){
        if (plusKey == key){
          $probs[clickedPos].value =  Number($probs[clickedPos].value) + counter
          $localStorage.workingDecision.choices[key] += counter
        } else if (!(isProbInvalid($localStorage.workingDecision.choices[key]-1))){
          $probs[keyNum].value --
          $localStorage.workingDecision.choices[key] --
        }
        keyNum ++
      }
    }
  }

  $scope.save = function(){
    console.log('save clicked')
    if (cleanProb($scope.workingDecision.totalSum) != 100){
      console.log('cannot save due to total probability')
    } else if (isTitleInvalid($scope.workingDecision.workingTitle)){
      console.log('cannot save due to invalid title')
    } else{
      //now need to check each probability
      var probChecker = true
      for (var key in $localStorage.workingDecision.choices){
        if( isProbInvalid($localStorage.workingDecision.choices[key])){
          console.log('cannot save as a specific prob is invalid')
          probChecker = false
          break
        }
      }
      if (probChecker){
        console.log('save passed all checks')

        //find if old key is in favorites, if so delete and save into favorites
        //else, delete and save into decisions
        $localStorage.workingDecision.workingChoice = ""

        if ($localStorage.Favorites[$localStorage.workingDecision.title]){
          delete $localStorage.Favorites[$localStorage.workingDecision.title]
          //now update title field
          $localStorage.workingDecision.title = $localStorage.workingDecision.workingTitle
          $localStorage.Favorites[$localStorage.workingDecision.workingTitle] = $localStorage.workingDecision
        } else {
          delete $localStorage.Decisions[$localStorage.workingDecision.title]
          //now update title field
          $localStorage.workingDecision.title = $localStorage.workingDecision.workingTitle
          $localStorage.Decisions[$localStorage.workingDecision.workingTitle] = $localStorage.workingDecision
        }
        if ($localStorage.fromRun){
          $state.go("run")
        } else{
          $localStorage.workingDecision = {}
          $state.go("home")
        }
        $localStorage.fromRun = false
      }
    }
  }

}); //END Controller