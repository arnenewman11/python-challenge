// Get references to the tbody element, input field and button
var $tbody = document.querySelector("tbody");
var $datetimeInput = document.querySelector("#date-time");
var $searchBtn = document.querySelector("#search");

// Add an event listener to the searchButton, call handleSearchButtonClick when clicked
$searchBtn.addEventListener("click", handleSearchButtonClick);

// Set filteredAddresses to addressData initially
var filteredDateTime = dataSet;

// renderTable renders the filteredAddresses to the tbody
function renderTable() {
  $tbody.innerHTML = "";
  for (var i = 0; i < filteredDateTime.length; i++) {
    // Get get the current address object and its fields
    var datetime = filteredDateTime[i];
    
	//Attempt at converting to MM/DD/YYYY from M/D/YYYY - Delete if needed
	//THIS WORKS FOR MM/DD ONLY... without this code it works if the date is exact (So this code currently makes it works)
	var filteredDateTimeElements = datetime.datetime.split('/');
	for (var k = 0; k<filteredDateTimeElements.length; k++){
	if (filteredDateTimeElements[k].length<2) {filteredDateTimeElements[k]= "0"+filteredDateTimeElements[k];} 
	else {filteredDateTimeElements[k] = filteredDateTimeElements[k];}
	}
	datetime.datetime = filteredDateTimeElements[0].concat("/",filteredDateTimeElements[1],"/",filteredDateTimeElements[2]);
	  	  
    var fields = Object.keys(datetime);
    // Create a new row in the tbody, set the index to be i + startingIndex
    var $row = $tbody.insertRow(i);
    for (var j = 0; j < fields.length; j++) {
      // For every field in the address object, create a new cell at set its inner text to be the current value at the current address's field
      var field = fields[j];
      var $cell = $row.insertCell(j);
      $cell.innerText = datetime[field];
    }
  }
}

function handleSearchButtonClick() {
  // Format the user's search by removing leading and trailing whitespace, lowercase the string
  var filterDateTime = $datetimeInput.value.trim();

  //Attempt at converting to MM/DD/YYYY from M/D/YYYY - Delete if needed
  //THIS WORKS FOR MM/DD ONLY... without this code it works if the date is exact (So this code currently makes it works)
  var dateTimeEntries = filterDateTime.split('/');
  //check the array
  console.log(dateTimeEntries)
  for (var i = 0; i<dateTimeEntries.length; i++){
  	if (dateTimeEntries[i].length<2) {dateTimeEntries[i]= "0"+dateTimeEntries[i];} 
  	else {dateTimeEntries[i] = dateTimeEntries[i];}
  };
  var filterDateTime = dateTimeEntries[0].concat("/",dateTimeEntries[1],"/",dateTimeEntries[2]);


  // Set filteredAddresses to an array of all addresses whose "datetime" matches the filter
  filteredDateTime = dataSet.filter(function(datetime) {
    var entryDateTime= datetime.datetime;

    // If true, add the datetime to the filteredDateTimes, otherwise don't add it 
    return filterDateTime === entryDateTime;
  });
  renderTable();
}

// Render the table for the first time on page load
renderTable();
