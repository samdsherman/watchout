// // start slingin' some d3 here.
// var jsonCircles = [
//   { "xAxis": 30, "yAxis": 30, "radius": 20, "color" : "green" },
//   { "xAxis": 70, "yAxis": 70, "radius": 20, "color" : "purple"},
//   { "xAxis": 110, "yAxis": 100, "radius": 20, "color" : "red"}];

// var svgContainer = d3.select("body").append("svg");

// var circles = svgContainer.selectAll("circle")
//                           .data(jsonCircles)
//                           .enter()
//                           .append("circle");

// var circleAttributes = circles
//                        .attr("cx", function (d) { return d.xAxis; })
//                        .attr("cy", function (d) { return d.yAxis; })
//                        .attr("r", function (d) { return d.radius; })
//                        .style("fill", function(d) { return d.color; });

var board = d3.select('.board').append('svg');

const numEnemies = 20;

var randomNum = function() {
  return Math.floor(Math.random() * 101);
};

var generateCirclePositions = function(numCircles) {
  var circleOptions = [];

  for (var i = 0; i < numCircles; i++) {
    circleOptions.push({'xAxis': randomNum(), 'yAxis': randomNum(), 'radius': 15, 'color': 'black'});
  }
  return circleOptions;
};

// Populate board with enemies
board.selectAll('.enemy').data(generateCirclePositions(numEnemies))
                         .enter().append('circle')
                         .attr('cx', function (d) { return d.xAxis + '%'; })
                         .attr('cy', function (d) { return d.yAxis + '%'; })
                         .attr('r', function (d) { return d.radius; })
                         .style('fill', function(d) { return d.color; })
                         .classed('enemy', true);

// Make them move!
var updateEnemyPosition = function() {
  board.selectAll('.enemy').data(generateCirclePositions(numEnemies))
                           .transition().duration(2000)
                           .attr('cx', function (d) { return d.xAxis + '%'; })
                           .attr('cy', function (d) { return d.yAxis + '%'; });
};

setInterval(updateEnemyPosition, 2000);

var newGame = true;

var playingFieldSize = {
  width: board.node().getBBox().width,
  height: board.node().getBBox().height
};

var dragstarted = function(d, i) {
  console.log('You started dragging!');
  if (newGame) {
    d.xAxis = 0;
    d.yAxis = 0;
    newGame = false;
  }
  
};
var dragged = function(d, i) {
  console.log(`x-axis: ${d.xAxis} y-axis: ${d.yAxis}`);
  d.xAxis += d3.event.dx;
  d.yAxis += d3.event.dy; 
  d3.select(this).attr('transform', function(d, i) {
    return 'translate(' + [ d.xAxis, d.yAxis ] + ')';
  });
};
var dragended = function() {
  console.log('You finished dragging!');
};

var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on('dragstart', dragstarted)
    .on('drag', dragged)
    .on('dragend', dragended);

// Create the player

var playerOptions = {'xAxis': playingFieldSize.width / 2, 'yAxis': playingFieldSize.height / 2, 'radius': 10, 'color': 'orange'};
board.selectAll('.player').data([playerOptions])
                          .enter().append('circle')
                          .attr('cx', function (d) { return d.xAxis; })
                          .attr('cy', function (d) { return d.yAxis; })
                          .attr('r', function (d) { return d.radius; })
                          .style('fill', function(d) { return d.color; })
                          .classed('player', true)
                          .call(drag);











