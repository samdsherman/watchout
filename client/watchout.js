var board = d3.select('.board').append('svg');
// var defs = board.append('svg:defs');
// defs.append('svg:pattern')
//     .attr('id', 'asteroid_img')
//     .attr('width', 30)
//     .attr('height', 30)
//     .append('svg:image')
//     .attr('xlink:href', 'asteroid.png')
//     .attr('width', 30)
//     .attr('height', 30)
//     .attr('x', 0)
//     .attr('y', 0);

const numEnemies = 25;
var playerRadius = 25;
var enemyRadius = 35;
var transitionTime = 2000;
var newGame = true;
var playerX = 0;
var playerY = 0;
var trackDifficulty = 99;
var level = d3.select('.level').selectAll('span');

var playingFieldSize = {
  width: board[0][0].scrollWidth,
  height: board[0][0].scrollHeight
};

var randomPixelX = function randomPixelX() {
  return Math.floor(Math.random() * playingFieldSize.width);
};

var randomPixelY = function randomPixelY() {
  return Math.floor(Math.random() * playingFieldSize.height);
};

var generateCirclePositions = function(numCircles) {
  var circleOptions = [];

  for (var i = 0; i < numCircles; i++) {
    circleOptions.push({'xAxis': randomPixelX(), 'yAxis': randomPixelY(), 'radius': enemyRadius, 'color': 'black'});
  }
  return circleOptions;
};

// Populate board with enemies
board.selectAll('.enemy').data(generateCirclePositions(numEnemies))
                         .enter().append('image')
                         .attr('x', function (d) { return d.xAxis; })
                         .attr('y', function (d) { return d.yAxis; })
                         .attr('xlink:href', 'asteroid.png')
                         .attr('height', enemyRadius * 2)
                         .attr('width', enemyRadius * 2)
                        //  .attr('r', function (d) { return d.radius; })
                         //  .style('fill', function(d) { return d.color; })
                         .classed('enemy', true);

// Make them move!
var updateEnemyPosition = function() {
  board.selectAll('.enemy').data(generateCirclePositions(numEnemies))
                           .classed('collided', false)
                           .transition().duration(transitionTime)
                           .tween('Hi Oleg', function(d, i) {
                             var score = d3.select('.current').selectAll('span');
                             score.text(parseInt(score.text(), 10) + 1);

                             var currentX = this.getAttribute('x');
                             currentX = parseInt(currentX, 10);

                             var currentY = this.getAttribute('y');
                             currentY = parseInt(currentY, 10);

                             var newX = d.xAxis;
                             var newY = d.yAxis;

                             var interpolateX = d3.interpolate(currentX, newX);
                             var interpolateY = d3.interpolate(currentY, newY);

                             return function(t) {
                               var enemyX = interpolateX(t);
                               var enemyY = interpolateY(t);

                               if (parseInt(score.text(), 10) > trackDifficulty) {
                                 if (transitionTime > 200) {
                                   transitionTime -= 100
                                 }
                                 trackDifficulty += 100;
                                 level.text(parseInt(level.text(), 10) + 1);
                                 console.log('LEVEL UP');
                               }

                               if (!d3.select(this).classed('collided') && Math.abs(enemyX - (playerX + playingFieldSize.width / 2)) < playerRadius + enemyRadius && Math.abs(enemyY - (playerY + playingFieldSize.height / 2)) < playerRadius + enemyRadius) {
                                 console.log('COLLISSION !!');
                                //  debugger;
                                 console.log(d3.select(this).classed('collided'));
                                 var currentCollisions = d3.select('.collisions').selectAll('span');
                                 currentCollisions.text(parseInt(currentCollisions.text(), 10) + 1);

                                 d3.select(this).classed('collided', true);
                                 var highScore = d3.select('.highscore').selectAll('span');

                                 if (parseInt(score.text(), 10) > parseInt(highScore.text(), 10)) {
                                   highScore.text(score.text());
                                 }
                                 score.text(0);
                                 level.text(0);
                                 transitionTime = 2000;
                               }

                             };
                           })
                           .attr('x', function (d) { return d.xAxis; })
                           .attr('y', function (d) { return d.yAxis; });
};

setInterval(updateEnemyPosition, transitionTime);

var dragstarted = function(d, i) {
  console.log('You clicked a draggable!');
  if (newGame) {
    d.xAxis = 0;
    d.yAxis = 0;
    newGame = false;
  }
};

var dragged = function(d, i) {
  // console.log(`x-axis: ${d.xAxis} y-axis: ${d.yAxis}`);
  d.xAxis += d3.event.dx;
  d.yAxis += d3.event.dy;
  d3.select(this).attr('transform', function(d, i) {
    return 'translate(' + [ d.xAxis, d.yAxis ] + ')';
  });
  playerX = d.xAxis;
  playerY = d.yAxis;
};

// Not using this right now
// var dragended = function() {
//   console.log('Mouse released!');
// };

var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on('dragstart', dragstarted)
    .on('drag', dragged);
    // .on('dragend', dragended);

// Create the player
var playerOptions = {'xAxis': playingFieldSize.width / 2, 'yAxis': playingFieldSize.height / 2, 'radius': playerRadius, 'color': 'orange'};
board.selectAll('.player').data([playerOptions])
                          .enter().append('image')
                          .attr('x', function (d) { return d.xAxis; })
                          .attr('y', function (d) { return d.yAxis; })
                          .attr('height', playerRadius * 2)
                          .attr('width', playerRadius * 2)
                          // .attr('r', function (d) { return d.radius; })
                          .attr('xlink:href', 'fred.gif')
                          .classed('player', true)
                          .call(drag);
