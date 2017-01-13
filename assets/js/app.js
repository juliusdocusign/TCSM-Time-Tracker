$(document).ready(function()
{
  var counter = 1;
  var url ="Accounts.json";
  var items = getFromLocal('TTI');
  var allItems = getFromLocal('allItems');
  var showData = $('#accountSelGroup');
  var date = new Date();
  var dateEx = new Date();
  var parsedDate = date.toDateString();
  var dateExported = dateEx;
  var intTime = 0;
  var totalTime = 0;
  var newTime = 0;
  var tIArray = [];

 baconTime();



  console.log(parsedDate);
  $('#bacon').append('<h3>'+ parsedDate +'</h3>');

  function baconTime(){
  console.log("baconTime");
  storeToLocal('PD',parsedDate);
  dateExported = getFromLocal('DE');
  parsedDate = getFromLocal('PD');


  $('#dateExported').text("Last Exported: " + dateExported);

  // if (parsedDate == dateExported) {
  //   dateExported = getFromLocal('DE');
  //   parsedDate = getFromLocal('PD');
  //   console.log("we are in IF" + parsedDate + dateExported);
  // $("#body").removeClass("notExported");
  //   $("#body").addClass("Exported");
  // } else {
  //   $("#body").removeClass("Exported");
  //   $("#body").addClass("notExported");
  //   return false;
  // }
}
  // Read accounts from json file
   $.getJSON(url, function (data) {


     var items2 = data.Accounts.map(function (item) {
       return item.value;
     });

     showData.empty();

     if (items2.length) {
       items2.sort();
       var content = '<option>' + items2.join('</option><option>') + '</option>';
       var list = content;
       showData.append(list);
     }
     return false;
   });

   loadList(items);

   // Weekly Total to CSV
   $('#exportToCSV').click(function()
   {
     var dateEx = new Date();
     dateExported = dateEx.toDateString();
     $('#dateExported').text('Last Exported: ' + dateExported);
     storeToLocal('DE',dateExported);
     var data = [];
     var headers = ["Date","Type","Account","Time Spent"];
     allItems.push(headers);
     data = allItems.reverse();
     var csvContent = "data:text/csv;charset=utf-8;,";
     data.forEach(function(infoArray, index){
        dataString = infoArray.join(",");
        csvContent += dataString+ "\n";
    // alert(csvContent);
      });
     var csvData = encodeURI(csvContent);
     link = document.createElement('a');
     link.setAttribute('href', csvData);
     link.setAttribute('download',"Weekly Total - "+ parsedDate+".csv");
     document.body.appendChild(link);
     link.click();
     //window.open(csvData);
     baconTime();
     location.reload();
   });

   // BackUp to CSV
   $('#BackUpToCSV').click(function()
   {
     var data = [];
     var headers = ["Date","Type","Account","Time Spent"];
     items.push(headers);
     data = items.reverse();
     var csvContent = "data:text/csv;charset=utf-8;,";
     data.forEach(function(infoArray, index){
        dataString = infoArray.join(",");
        csvContent += dataString+ "\n";
    // alert(csvContent);
      });
     var csvData = encodeURI(csvContent);
     link = document.createElement('a');
     link.setAttribute('href', csvData);
     link.setAttribute('download',"Backup for " +parsedDate+".csv");
     document.body.appendChild(link);
     link.click();
     //window.open(csvData);
     location.reload();
   });

  $("#menu-toggle").click(function(e)
  {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
      $("#timeInputDiv").toggleClass("has-success");
  });

// Add Tasks to storage
$('#addTask').click(function(){
    var item2 = [], item3 = [], item4 = [], itemDate = [], value = [];

    item2.push($('#typeSel').val());
    item3.push($('#accountSelGroup').val());
    item4.push($('#timeInput').val());
    itemDate.push(parsedDate);

    value = itemDate.concat(item2,item3,item4);

    items.reverse();
    allItems.reverse();
    //console.log(value);
    if (item3 != "-- Select One --" && item2 != "-- Select One --"){
      console.log("this is timeinput "+ item4);
      items.push(value);
      allItems.push(value);
      storeToLocal('TTI', items);
      storeToLocal('allItems', allItems);
      loadList(items);

      $('#typeSel').val("-- Select One --");
      $('#accountSelGroup').val("-- Select One --");
      $('#timeInput').val("");
    //  location.reload();
    } else {
      alert("Please complete all fields");
      return false;
    }


    //  alert(items);
	});

  // add to CSV
  $('#addOnButton').click(function(){
    var dateCompare = "blah";

  });

  // Clear All Tasks

  $('#clearAll').click(function(){

    if (confirm("Are you sure you want to delete ALL items?")) {
    //event.stopPropagation();
    allItems = [];
    items= [];
    console.log(allItems);
    storeToLocal('allItems', allItems);
    storeToLocal('TTI', items);
    loadList(items);
    taskCount();
    hourCount();
    location.reload();
  }
    return false;
   });
   $('#clearYesterday').click(function(){

     if (confirm("Are you sure you want to delete current items?")) {
     //event.stopPropagation();
     items = [];
     console.log(items);
     storeToLocal('TTI', items);
     loadList(items);
     taskCount();
     hourCount();
     location.reload();
   }
     return false;
    });


	// Delete One Item
	$('.toDoListGroup').delegate('.delete', 'click', function(event)
  {
    if (confirm("Are you sure?")) {
      //event.stopPropagation();
      index = $('.delete').index(this);
      console.log("deleting item " + index);
      $('.toDoItem').eq(index).slideUp("fast", function()
      {
        console.log(allItems[index]);
        console.log(items[index]);
        $(this).remove();
        taskCount();
        hourCount();
        //location.reload();
      });

      items.splice(index, 1);
      allItems.reverse();
      allItems.splice(index, 1);

      storeToLocal('TTI', items);
      storeToLocal('allItems', allItems);
    }
      return false;
  	});


	// edit panel
	$('.toDoListGroup').delegate('.edit-button', 'click', function()
  {
    $('#timeInputM').val();
    $('#editItems').remove();
		index = $('.edit-button').index(this);
    console.log(index);
    console.log(items);
		var content = items[index];
    var editItem1 = content[3];

		$('#timeInputM').val(editItem1);
    $('#accountSelGroupM').append('<option id="editItems">'+ content[2]+'</option>');
    $('#edit-button').click(function(){
      items[index][3] = $('#timeInputM').val();
      allItems[index][3] = $('#timeInputM').val();
      items.reverse();
      allItems.reverse();
      storeToLocal("TTI", items);
      storeToLocal("allItems", allItems);
      loadList(items);
      location.reload();
    });
	});



	// loadList
	function loadList(items)
  {

	  $('.toDoItem').remove();
		if(items.length > 0) {
      tIArray =[];
      items.reverse();
      allItems.reverse();
			for(var i = 0; i < items.length; i++) {

          $('.toDoListGroup').append('<li class= "list-group-item toDoItem"><p>'+'<b>Date: </b>'+' ' + items[i][0]+' '+'<b>Type: </b>'+' ' + items[i][1] +' '+'<b>Account: </b>'+' '+ items[i][2]+' '+'<b>Time: </b>'+ items[i][3] + '</p><button type="button" class="btn btn-success edit-button" data-toggle="modal" data-target="#editModal">Edit</button><button id="deleteDep" type="button" style="float: right;" class="disabled btn btn-danger">Delete</button></li>');
          newTime = 0;
          intTime = 0;
          var timeInputArray = [items[i][3]];
          tIArray.push(timeInputArray);
          intTime = tIArray.map(Number);
          newTime = intTime.reduce(add, 0);

            function add(a, b) {
            return a + b;
            }
          taskCount();
          hourCount();


      }
		}

	};

	function storeToLocal(key, items)
  {
		localStorage[key] = JSON.stringify(items);
	}

	function getFromLocal(key)
  {
		if(localStorage[key])
			return JSON.parse(localStorage[key]);
		else
			return [];
	}

  // Count Tasks
  function taskCount()
  {
    var taskCounter = $('.toDoItem').length;
    $("#totalTasks").text(taskCounter);
  }

  // Count Hours
 function hourCount()
 {
   var hoursCounter = 0;
   $("#totalHours").text(newTime);
   console.log(hoursCounter);

   if (newTime > 24){
     $("#totalHrsPanelDiv").removeClass("panel-green");
     $("#totalHrsPanelDiv").addClass("panel-red");
   } else {
     $("#totalHrsPanelDiv").removeClass("panel-red");
     $("#totalHrsPanelDiv").addClass("panel-green");
   }
 }
 hourCount();
});
