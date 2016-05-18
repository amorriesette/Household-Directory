
// Create an array of objects that will store address information
var household = angular.module('householdApp', []);
household.controller('householdCtrl', function($scope){
    $scope.household = [];
    $scope.currentDate = "test";
// Initialize an empty array full of 0's
    var activeMonthArray = [];
    for(var i=0; i<=12; i++){
      activeMonthArray[i] = 0;
    }

// Create a hash of months so we can map month names to month number
    var monthsList = {
      'January':1,
      'February':2,
      'March':3,
      'April':4,
      'May':5,
      'June':6,
      'July':7,
      'August':8,
      'September':9,
      'October':10,
      'November':11,
      'December':12
    }

//Flag to keep up with override status
    var overrideFlag = 0;

// Iterates through the array and returns true if no address is found within the
// given timeframe.
    $scope.validateMonths = function(start, end){
        for(var i=start; i<= end;i++){
          if(activeMonthArray[i] != 0){
            return false;
          }
        }
        return true;
    }

// Add the address to the array for the passed in start and end time frames
    $scope.addToActiveArray = function(start, end, address){
        var isValid = $scope.validateMonths(start,end);
        if(isValid){
          for(var i=start; i<=end; i++){
            activeMonthArray[i] = address;
          }
          return true;
        }else{
          return false;
        }
    }

// Remove addresses from the activeArray by replacing its contents with "0"
    $scope.removeFromActiveArray = function(start, end){
      var start = monthsList[start];
      var end = monthsList[end];
      for(var i=start; i<=end; i++){
        activeMonthArray[i] = 0;
      }
      return true;
    }


// Sets currents date on page load
    $scope.setCurrentDate = function(){
      var today = new Date();
      var year = today.getFullYear();
      var month = today.getMonth()+1;
      if(month < 10){ month = '0' + month};
      var day = today.getDate();
      var date = month + '/' + day + "/" + year;
      $scope.currentDate = 'Current Date: ';
      //$('#currentDate').text('Current Date: ' + date);
    }();


// Gets current month
    $scope.getCurrentMonth = function(){
      var month = parseInt($('#dateChange').val());
      $scope.changeCurrentDate(month);
      $scope.changeActiveAddr(month);
      $('#dateChange').val("0");
    }


// Changes current date via drop down menu
    $scope.changeCurrentDate = function(cMonth){
      var today = new Date();
      var year = today.getFullYear();
      var month = cMonth;
      if(month < 10){ month = '0' + month};
      var day = today.getDate();
      var date = month + '/' + day + "/" + year;
      $scope.currentDate = 'Current Date: ';
      //$('#currentDate').text('Current Date: ' + date);
    }


// Deletes Address from the UI and removes instances from the activeArray
  $scope.deleteAddress = function(items){
    $scope.removeFromActiveArray(monthsList[items.startDate], monthsList[items.endDate]);
    for(var i in $scope.household){
        if($scope.household[i] === items){
            $scope.household.splice(i, 1);
        }
      }
    }

// Adds a new address to the database
  $scope.newAddress = function(){
      var addAddress = document.querySelector('.modal');
      var type = addAddress.querySelector('.type');
      var stName = addAddress.querySelector('.stName');
      var city = addAddress.querySelector('.city');
      var state = addAddress.querySelector('.state');
      var zip = addAddress.querySelector('.zip');
      var dateFrom = addAddress.querySelector('.dateFrom');
      var dateTo = addAddress.querySelector('.dateTo');

      var newRecord = $scope.validateMonths(monthsList[dateFrom.value], monthsList[dateTo.value]);
      if(newRecord || overrideFlag == 1){
        var newAddress = stName.value +', ' + city.value+', '+state.value+" "+ zip.value;
        if(overrideFlag == 1){
          $scope.deactivateDuplicate(monthsList[dateFrom.value], monthsList[dateTo.value], newAddress);
          overrideFlag = 0;
        }
        eval('$scope.household').push({
            type: type.value,
            address: newAddress,
            city: city.value,
            state: state.value,
            zip: zip.value,
            startDate: dateFrom.value,
            endDate: dateTo.value,
            activate:true
        });
        $scope.addToActiveArray(monthsList[dateFrom.value], monthsList[dateTo.value], newAddress);
        $scope.clearForm();
      }else{
        $("#errorMsg").removeClass('ng-hide');
        $("#submitBtn").removeClass('btn-primary');
        $("#submitBtn").addClass('btn-danger');
        overrideFlag = 1;
      }
  }

  $scope.deactivateDuplicate = function(startDate, endDate , address){
      for(i in $scope.household){
        for(var i=startDate; i<=endDate; i++){
          if(activeMonthArray[i] != 0){
            activeMonthArray[i] = 0;
          }
        }
      }
  }

  // Removes address from the activeArray but keeps the object visible in the UI
      $scope.toggleActivateAddr = function(items){
        for(var i in $scope.household){
          if($scope.household[i] === items){
            var item = $scope.household[i];
            if(item.activate){
              $scope.removeFromActiveArray(monthsList[item.startDate], monthsList[item.endDate]);
              $('#activateCheck').checked=false;
              item.activate = false;
            }else{
              var validate = $scope.validateMonths(monthsList[item.startDate], monthsList[item.endDate]);
              if(validate){
                $scope.addToActiveArray(monthsList[item.startDate], monthsList[item.endDate], item.address);
                $('#activateCheck').checked=true;
                item.activate = true;
              }else{
                event.preventDefault();
                $('#activateCheck').checked=false;
              }
            }
          }
        }
      }


// Pre-populates the text fields for editing and replaces the old info with the new info
      $scope.editAddress = function(items){
        $('#newAddressOverlay').modal('show');
        var type = items.type;
        var address = items.address;
        var addressArray = address.split(',');
        var stName = addressArray[0];
        var city = addressArray[1];
        var stateZip = addressArray[2].split(' ');
        var state = stateZip[1];
        var zip = stateZip[2];
        var dateTo = items.endDate;
        var dateFrom = items.startDate;

        var inputTypes = ["type", "stName", "city", "state","zip","dateTo","dateFrom"];
        var inputTypesDot = [".type", ".stName", ".city", ".state",".zip",".dateTo",".dateFrom"];

        for(var i=0; i<=inputTypes.length; i++){
          var inputVal = eval(inputTypes[i]);
          $(inputTypesDot[i]).val(inputVal);
        }
        removeFromActiveArray(monthsList[item.startDate], monthsList[item.endDate]);
      }


// Removes address from the activeArray but keeps the object visible in the UI
    $scope.activateAddr = function(items){
      for(var i in $scope.household){
        if($scope.household[i] === items){
          var item = $scope.household[i];
          if(item.activate){
            $scope.removeFromActiveArray(monthsList[item.startDate], monthsList[item.endDate]);
            $('#activateCheck').checked=false;
            item.activate = false;
          }else{
            var validate = $scope.validateMonths(monthsList[item.startDate], monthsList[item.endDate]);
            if(validate){
              $scope.addToActiveArray(monthsList[item.startDate], monthsList[item.endDate], item.address);
              $('#activateCheck').checked=true;
              item.activate = true;
            }else{
              event.preventDefault();
              $('#activateCheck').checked=false;
            }
          }
        }
      }
    }



// Changes the active address based on the current month
    $scope.changeActiveAddr = function(currentMonth){
      var invalid = $scope.validateMonths(currentMonth, currentMonth);
      if(!invalid){
        var address = activeMonthArray[currentMonth];
        for(var i in $scope.household){
          if($scope.household[i].address == address){
            $('#noAddr').text($scope.household[i].address);
          }
        }
      }else{
        $('#noAddr').text('No Address Currently Available!');
      }
    }



// Clears all data in the address form
    $scope.clearForm = function(){
      var inputTypes = ['.type', '.stName', '.city', '.state','.zip','.dateTo','.dateFrom'];
      for(var i=0; i<= inputTypes.length;i++){
        $(inputTypes[i]).val('');
      }

      $("#errorMsg").addClass('ng-hide');
      $("#overideBtn").addClass('ng-hide');
      $('#newAddressOverlay').modal('hide');
    }


    /*Function Tests
    (function testValidateMonths (){
      console.log('TEST VALIDATE MONTHS:')
          var start = 9,
              end = 12,
              valueExpected= true;

          if ($scope.validateMonths (start, end) === valueExpected) {
              console.log("Passed!");
          }else {
              console.log("Failed!");
          }
    }());
    (function testAddToActiveArray (){
      console.log('TEST ADDTOACTIVEARRAY:')
          var start = 2,
              end = 4,
              type = 'Home',
              valueExpected= true;

          if ($scope.addToActiveArray (start, end, type) === valueExpected) {
              console.log("Passed!");
          }else {
              console.log($scope.activeMonthArray);
              console.log("Failed!");
          }
    }());
    (function testAddToActiveArray (){
      console.log('TEST ADDTOACTIVEARRAY:')
          var start = 7,
              end = 10,
              type = 'Beach',
              valueExpected= true;

          if ($scope.addToActiveArray (start, end, type) === valueExpected) {
              console.log("Passed!");
          }else {
              console.log("Failed!");
          }
    }());
    (function testRemoveFromActiveArray (){
      console.log('TEST REMOVEFROMACTIVEARRAY:')
          var startDate = 5,
              endDate = 6,
              type="City",
              valueExpected=true,
              flag=true;

          var add = $scope.addToActiveArray(startDate, endDate,type);
          $scope.removeFromActiveArray(startDate, endDate);
          for(var i=startDate; i<=endDate; i++){
            if(activeMonthArray[i] != 0){
              console.log(activeMonthArray);
              flag = false;
            }
          }

          if(flag === valueExpected){
            console.log("Passed!");
          }else {
              console.log("Failed!");
          }
    }());*/




});
