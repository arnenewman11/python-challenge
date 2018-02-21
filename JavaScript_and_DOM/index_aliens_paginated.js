// Get references to the tbody element, input field and button
var $tbody = document.querySelector("tbody");
var $datetimeInput = document.querySelector("#date-time");
var $stateInput = document.querySelector("#state-input");
var $cityInput = document.querySelector("#city-input");
var $countryInput = document.querySelector("#country-input");
var $shapeInput = document.querySelector("#shape-input");
var $searchBtn = document.querySelector("#search");
var $loadMoreBtn = document.querySelector("#load-btn");

// Add an event listener to the searchButton, call handleSearchButtonClick when clicked
$searchBtn.addEventListener("click", handleSearchButtonClick);

// Set filteredSightings to full dataSet initially
var filteredSightings = dataSet;

// Set a startingIndex and resultsPerPage variable
var startingIndex = 0;
var resultsPerPage = 50;

// renderTable renders the filteredSightings to the tbody
function renderTablesection() {
  $tbody.innerHTML = "";

    // Set the value of endingIndex to startingIndex + resultsPerPage
  var endingIndex = startingIndex + resultsPerPage;
  // Get a section of the addressData array to render
  var sightingSubset = filteredSightings.slice(startingIndex, endingIndex);


  for (var i = 0; i < sightingSubset.length; i++) {
    // Get get the current sighting object and its fields
    var sightingData = sightingSubset[i];
    
  	//Attempt at converting to MM/DD/YYYY from M/D/YYYY 
  	var dateTimeElements = sightingData.datetime.split('/');
  	for (var k = 0; k<dateTimeElements.length; k++){
  	if (dateTimeElements[k].length<2) {dateTimeElements[k]= "0"+dateTimeElements[k];} 
  	else {dateTimeElements[k] = dateTimeElements[k];}
  	}
  	sightingData.datetime = dateTimeElements[0].concat("/",dateTimeElements[1],"/",dateTimeElements[2]);
	  	  
    var fields = Object.keys(sightingData);

    //ERROR IS HERE Create a new row in the tbody, set the index to be i + startingIndex
    var $row = $tbody.insertRow(i + startingIndex);
    for (var j = 0; j < fields.length; j++) {
      // For every field in the address object, create a new cell at set its inner text to be the current value at the current address's field
      var field = fields[j];
      var $cell = $row.insertCell(j);
      $cell.innerText = sightingData[field];
    }
  }
}

function handleSearchButtonClick() {
  // Format the user's search by removing leading and trailing whitespace, lowercase the string
  var filterDateTime = $datetimeInput.value.trim();
  var filterState = $stateInput.value.trim().toLowerCase();
  var filterCountry = $countryInput.value.trim().toLowerCase();
  var filterShape = $shapeInput.value.trim().toLowerCase();
  var filterCity = $cityInput.value.trim().toLowerCase();

  //Attempt at converting to MM/DD/YYYY from M/D/YYYY - Delete if needed
  var dateTimeEntries = filterDateTime.split('/');
  //check the array
  console.log(dateTimeEntries)
  for (var i = 0; i<dateTimeEntries.length; i++){
  	if (dateTimeEntries[i].length<2) {dateTimeEntries[i]= "0"+dateTimeEntries[i];} 
  	else {dateTimeEntries[i] = dateTimeEntries[i];}
  };
  var filterDateTime = dateTimeEntries[0].concat("/",dateTimeEntries[1],"/",dateTimeEntries[2]);


  // Set filteredAddresses to an array of all addresses whose "datetime" matches the filter
  filteredSightings = dataSet.filter(function(sighting) {
    var sightingDateTime= sighting.datetime;
    var sightingCity = sighting.city.substring(0, filterCity.length).toLowerCase();
    var sightingState = sighting.state.substring(0, filterState.length).toLowerCase();
    var sightingCountry = sighting.country.substring(0, filterCountry.length).toLowerCase();
    var sightingShape = sighting.shape.substring(0, filterShape.length).toLowerCase();

    //var filters = [sightingDateTime,sightingCity,sightingState,,sightingCountry,sightingShape]
    //var inputs = [filterDateTime, filterCity, filterState, filterCountry, filterShape]

    // WORK ON THIS SO THAT IT SHOWS OPTIONS WHEN ONLY SOME FILTERS LEFT BLANK
    if (filterDateTime === (sightingDateTime || "") && filterCity === (sightingCity || "") && filterState
      === (sightingState || "") && filterCountry === (sightingCountry ||"") && filterShape === (sightingShape || ""))

    {return true;
    }
    return false;
  });
  renderTablesection();
}

// Add an event listener to the button, call handleButtonClick when clicked
$loadMoreBtn.addEventListener("click", handleButtonClick);

function handleButtonClick() {
  // Increase startingIndex by resultsPerPage, render the next section of the table
  startingIndex += resultsPerPage;
  
  // Check to see if there are any more results to render
  if (startingIndex + resultsPerPage >= filteredSightings.length) {
    $loadMoreBtn.classList.add("disabled");
    $loadMoreBtn.innerText = "All Sightings Loaded";
    $loadMoreBtn.removeEventListener("click", handleButtonClick);
  } else {renderTablesection();}
}

// Render the table for the first time on page load
renderTablesection();
