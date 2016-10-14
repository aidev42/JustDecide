angular.module('JustDecide').controller("SettingsController",function($scope, $state, $ionicHistory, $localStorage, $ionicPopover, $http){

  /*
  TO DO:
  5) Once finished with settings view and controller, go back and add popups for any type of delete or error message, and saving and loading data (are you sure, laoding data will overrwrite existing data)

  */

  //BEGIN Controller
  $scope.initSettings = function(){
    $scope.formData = {}
    $scope.formData.smartMinusPlus = $localStorage.smartMinusPlus
    $scope.formData.lockout = $localStorage.lockout
    console.log($scope.formData.smartMinusPlus)
  }

  var template = '<ion-popover-view id="popover"><ion-header-bar><h1 class="title">{{formData.popoverTitle}}</h1></ion-header-bar><ion-content>{{formData.popoverContent}}</ion-content></ion-popover-view>';

  $scope.popover = $ionicPopover.fromTemplate(template, {
    scope: $scope
  });

  $scope.openPopover = function($event,type) {
    console.log(type)

    if (type == 'smart'){
      $scope.formData.popoverTitle = "Smart Prob -/+"
      $scope.formData.popoverContent = "When Smart Prob is on, clicking the -/+ buttons in the decision create/edit screen when the total probability is not 100 will only update probabilities if the total would move closer to 100. If the probability is already 100, the buttons will keep the total unchanged by redistributing probabilties from other choices to the choice selected to decrease/increase."
    } else if (type == 'lockout'){
      $scope.formData.popoverTitle = "5 Min Lockout"
      $scope.formData.popoverContent = "To help commit to your custom decision use this option to prevent you from running a decision multiple times. When this option is on, after running a decision you will be unable to generate a new result for that same decision until 5 minutes have elapsed."
    } else if (type == 'clear'){
      $scope.formData.popoverTitle = "Clear All Local Data"
      $scope.formData.popoverContent = "This option will delete all your custom decisions currently stored on your local device and restore all app settings to defaults. It can not be undone."
    } else if (type == 'backup'){
      $scope.formData.popoverTitle = "Backup Data"
      $scope.formData.popoverContent = "By entering a unique email and password of your choosing you can backup your local custom decisions to the cloud, or retrieve data previously saved to the cloud to your local device."
    }
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });


  $scope.test = function(){
    console.log('test')
  }

  $scope.smartToggle = function(current){
    console.log(current)
    if (current){
      $localStorage.smartMinusPlus = true
    } else{
      $localStorage.smartMinusPlus = false
    }
    console.log('storage is now: ', $localStorage.smartMinusPlus)
    console.log('scope is now: ', $scope.formData.smartMinusPlus)
  }

  $scope.lockoutToggle = function(current){
    console.log(current)
    if (current){
      $localStorage.lockout = true
    } else{
      $localStorage.lockout = false
    }
    console.log('storage is now: ', $localStorage.lockout)
    console.log('scope is now: ', $scope.formData.lockout)
  }

  $scope.clearAll = function(){
    console.log($localStorage)
    $localStorage.Decisions = {}
    $localStorage.Favorites = {}
    $localStorage.example = false
    $localStorage.fromRun = false
    $localStorage.workingDecision = {}
    $localStorage.smartMinusPlus = true
    $localStorage.lockout = false
    $scope.initSettings()
  }

  $scope.backupData = function(email,password){
    console.log(email)
    console.log(password)

    $http({
      method: "POST",
      url: "https://justdecide-db.herokuapp.com/",
      data: {
        email: email,
        password: password,
        userData: {
          favorites: $localStorage.Favorites,
          decisions: $localStorage.Decisions
        }
      }
    })
    .success(function(result) {
      //upon success clear the input fields

    })
    .error(function(error){
      console.log(JSON.stringify(error));
    });
  }

  $scope.retrieveData = function(email,password){
    console.log(email)
    console.log(password)

    $http({
      method: "POST",
      url: "https://justdecide-db.herokuapp.com/retrieve",
      data: {
        email: email,
        password: password
      }
    })
    .success(function(result) {
      $localStorage.Favorites = result.Favorites
      $localStorage.Decisions = result.Decisions

      // $state.go("home");
    })
    .error(function(error){
      console.log(JSON.stringify(error));
    });
  }
}); //END Controller