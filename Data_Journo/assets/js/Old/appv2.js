// When the browser window is resized, responsify() is called.
d3.select(window).on("resize", makeResponsive);

// When the browser loads, makeResponsive() is called.
makeResponsive();

// The code for the chart is wrapped inside a function that automatically resizes the chart
function makeResponsive() {
  // if the SVG area isn't empty when the browser loads, remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and height of the browser window.
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var pizzasEatenByMonth = [15, 5, 25, 18, 12, 22, 0, 4, 15, 10, 21, 2];

  var svg = d3
    .select(".chart")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // line generator
  var line = d3
    .line()
    .x(function(data, index) {
      return index * svgWidth / 20;
    })
    .y(function(data, index) {
      return 600 - data * svgHeight / 80;
    });

  d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

  var chart = svg.append("g").attr("transform", "translate(100,-300)");

  chart
    .append("path")
    .attr("d", line(pizzasEatenByMonth))
    .attr("fill", "none")
    .attr("stroke", "blue")
    .transition()
    .duration(2000)
    .attr("stroke", "green");

  chart
    .selectAll("circle")
    .data(pizzasEatenByMonth)
    .enter()
    .append("circle")
    .attr("cx", function(data, index) {
      return -20;
    })
    .attr("cy", function(data, index) {
      return -20;
    })
    .attr("r", "10")
    .attr("fill", "red")
    .on("mouseover", function(data, index) {
      d3.select(this).transition().attr("fill", "purple");
    })
    .on("click", function(data, index) {
      d3
        .select(this)
        .transition()
        .duration(1000)
        .attr("r", 20)
        .attr("fill", "lightblue");
    })
    .on("mouseout", function(data, index) {
      d3
        .select(this)
        .transition()
        .duration(1000)
        .attr("r", 10)
        .attr("fill", "red");
    });

  // This code creates the initial transition effect when the page is loaded
  chart
    .selectAll("circle")
    .transition()
    .duration(1000)
    .attr("cx", function(data, index) {
      return index * svgWidth / 20;
    })
    .attr("cy", function(data, index) {
      return 600 - data * svgHeight / 80;
    });
}
