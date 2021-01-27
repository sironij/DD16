$(document).ready(function() {


  //Grid d3

  var width = 2000,
    height = 1200,
    xStepsBig = d3.range(10, width, 20),
    yStepsBig = d3.range(10, height, 20),
    xStepsSmall = d3.range(0, width + 6, 6),
    yStepsSmall = d3.range(0, height + 6, 6);

  var fisheye = d3.fisheye();

  var line = d3.svg.line();

  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(-.5,-.5)")
    .classed("griglia",true);

  svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);

  svg.selectAll(".x")
    .data(xStepsBig)
    .enter().append("path")
    .attr("class", "x")
    .datum(function(x) {
      return yStepsSmall.map(function(y) {
        return [x, y];
      });
    });

  svg.selectAll(".y")
    .data(yStepsBig)
    .enter().append("path")
    .attr("class", "y")
    .datum(function(y) {
      return xStepsSmall.map(function(x) {
        return [x, y];
      });
    });

  var path = svg.selectAll("path")
    .attr("d", line);

  svg.on("mousemove", function() {
    fisheye.center(d3.mouse(this));
    path.attr("d", function(d) {
      return line(d.map(fisheye));
    });
  });

  });
