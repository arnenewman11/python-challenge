
// Dropdown selector list to append options to
var selectDiv = document.getElementById("selDataset");

// Add options to list
Plotly.d3.json("/names", function(error, response) {
  if (error) return console.warn(error);
  var IDs = response;
  for (var i = 0; i < IDs.length; i++) {
    var option = document.createElement("option");
    option.value = IDs[i];
    option.text = IDs[i];
    selectDiv.appendChild(option);
  }
})


///////// Default

// Pie chart
Plotly.d3.json("/samples/BB_940", function(error, response) {
    if (error) return console.warn(error);
    var data = [{values: response.sample_values.slice(0,10),
                labels: response.otu_ids.slice(0,10),
                type: "pie"}

    ];
    var layout = {autosize:false,
      width: 300, 
      height: 300,
      margin: {l: 20, r: 20, b: 20, t: 20}};
    
    Plotly.plot("pie", data, layout);
})

// Bubble chart
Plotly.d3.json("/samples/BB_940", function(error, response){
    if (error) return console.warn(error);
    var data = [{
        x: response.otu_ids,
        y: response.sample_values,
        mode: 'markers',
        marker: {
            color: response.otu_ids,
            size: response.sample_values
        }
    }];
    var layout = {
        height: 600,
        width: 900,
        title: "Belly Button Contents",
        xaxis: {title: "OTUs"},
        yaxis: {title: "Value by Sample"}
    };
    Plotly.plot("bubble", data, layout);

})

// Restyle pie chart
function updatePie(newdata) {
  var Pie = document.getElementById("pie");
  Plotly.restyle(Pie, "labels", [newdata.otu_ids.slice(0,10)]);
  Plotly.restyle(Pie, "values", [newdata.sample_values.slice(0,10)]);
}

// restyle/update Bubble
function updateBub(newdata) {
    var Bub = document.getElementById("bubble");
    Plotly.restyle(Bub, "x", [newdata.otu_ids]);
    Plotly.restyle(Bub, "y", [newdata.sample_values]);
}



////////////////////////////////////////
// Option changed function
////////////////////////////////////////

function optionChanged(sample) {
    var sampURL = `/samples/${sample}`
    var metaURL = `/metadata/${sample}`

    // New data
    Plotly.d3.json(sampURL, function(error, response) {
      if (error) return console.warn(error);
      var vals = [];
      var labs = [];
      for (var i = 0; i < 50; i++){
        vals.push(response.sample_values[i]);
        labs.push(response.otu_ids[i]);
      }
      newdata = {values: vals, labels: labs};
      updatePie(newdata);
      updateBub(newdata);
    });
}