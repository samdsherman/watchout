// // start slingin' some d3 here.
// var jsonCircles = [
//   { "x_axis": 30, "y_axis": 30, "radius": 20, "color" : "green" },
//   { "x_axis": 70, "y_axis": 70, "radius": 20, "color" : "purple"},
//   { "x_axis": 110, "y_axis": 100, "radius": 20, "color" : "red"}];

// var svgContainer = d3.select("body").append("svg");

// var circles = svgContainer.selectAll("circle")
//                           .data(jsonCircles)
//                           .enter()
//                           .append("circle");

// var circleAttributes = circles
//                        .attr("cx", function (d) { return d.x_axis; })
//                        .attr("cy", function (d) { return d.y_axis; })
//                        .attr("r", function (d) { return d.radius; })
//                        .style("fill", function(d) { return d.color; });

var board = d3.select('.board').append('svg');

var randomNum = function() {
  return Math.floor(Math.random() * 101);
};


var generateCirclePositions = function(numCircles) {
  var circleOptions = [];

  for (var i = 0; i < numCircles; i++) {
    circleOptions.push({'x_axis': randomNum(), 'y_axis': randomNum(), 'radius': 10, 'color': 'black'});
  }
  return circleOptions;
};

// Populate board with circles
board.selectAll('circle').data(generateCirclePositions(50))
                         .enter().append('circle')
                         .attr('cx', function (d) { return d.x_axis + '%'; })
                         .attr('cy', function (d) { return d.y_axis + '%'; })
                         .attr('r', function (d) { return d.radius; })
                         .style('fill', function(d) { return d.color; });

// Make them move!
var update = function() {
  board.selectAll('circle').data(generateCirclePositions(50))
                           .transition().duration(1000)
                           .attr('cx', function (d) { return d.x_axis + '%'; })
                           .attr('cy', function (d) { return d.y_axis + '%'; });
};

setInterval(update, 2000);
