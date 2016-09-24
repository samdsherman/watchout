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

const numEnemies = 40;
var playingFieldSize = {
  width: board[0][0].scrollWidth,
  height: board[0][0].scrollHeight
};

var generateCirclePositions = function(numCircles) {
  var circleOptions = [];

  for (var i = 0; i < numCircles; i++) {
    circleOptions.push({'xAxis': randomPixelX(), 'yAxis': randomPixelY(), 'radius': 15, 'color': 'black'});
  }
  return circleOptions;
};

// Populate board with enemies
board.selectAll('.enemy').data(generateCirclePositions(numEnemies))
                         .enter().append('circle')
                         .attr('cx', function (d) { return d.xAxis; })
                         .attr('cy', function (d) { return d.yAxis; })
                         .attr('r', function (d) { return d.radius; })
                         .style('fill', function(d) { return d.color; })
                         .classed('enemy', true);

// Make them move!
var updateEnemyPosition = function() {
  board.selectAll('.enemy').data(generateCirclePositions(numEnemies))
                           .classed('collided', false)
                           .transition().duration(2000)
                           .tween('Hi Oleg', function(d, i) {
                             var score = d3.select('.current').selectAll('span');
                             score.text(parseInt(score.text(), 10) + 1);
                             var currentX = this.getAttribute('cx');
                             currentX = parseInt(currentX, 10);
                             var currentY = this.getAttribute('cy');
                             currentY = parseInt(currentY, 10);
                             var newX = d.xAxis;
                             var newY = d.yAxis;
                             var interpolateX = d3.interpolate(currentX, newX);
                             var interpolateY = d3.interpolate(currentY, newY);
                             return function(t) {
                              // debugger;

                               var enemyX = interpolateX(t);
                               var enemyY = interpolateY(t);
                               if (!d3.select(this).classed('collided') && Math.abs(enemyX - (playerX + playingFieldSize.width / 2)) < 25 && Math.abs(enemyY - (playerY + playingFieldSize.height / 2)) < 25) {
                                 console.log('COLLISSION !!');
                                 console.log(d3.select(this).classed('collided'));
                                 var currentCollisions = d3.select('.collisions').selectAll('span');
                                 currentCollisions.text(parseInt(currentCollisions.text(), 10) + 1);
                                 d3.select(this).classed('collided', true);
                                 var highScore = d3.select('.highscore').selectAll('span');
                                 if (parseInt(score.text(), 10) > parseInt(highScore.text(), 10)) {
                                   highScore.text(score.text());
                                 }
                                 score.text(0);
                               }

                             };
                           })
                           .attr('cx', function (d) { return d.xAxis; })
                           .attr('cy', function (d) { return d.yAxis; });
};

setInterval(updateEnemyPosition, 2000);

var newGame = true;
var playerX = 0;
var playerY = 0;

var randomNum = function() {
  return Math.floor(Math.random() * 101);
};

function randomPixelX() {
  return Math.floor(Math.random() * playingFieldSize.width);
}
function randomPixelY() {
  return Math.floor(Math.random() * playingFieldSize.height);
}

var dragstarted = function(d, i) {
  console.log('You clicked a draggable!');
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
  playerX = d.xAxis;
  playerY = d.yAxis;
};
var dragended = function() {
  console.log('Mouse released!');
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











