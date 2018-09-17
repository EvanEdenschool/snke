var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var snake = [
  [ 0, 0 ],
  [ 1, 0 ],
  [ 2, 0 ],
];
var direction = 1;

setInterval(function() {
  var dir;
  snake.shift();

  switch (direction) {
    case 0:
      dir = [ 0, -1 ];
      break;

    case 1:
      dir = [ 1, 0 ];
      break;

    case 2:
      dir = [ 0, 1 ];
      break;

    case 3:
      dir = [ -1, 0 ];
      break;

    default:
      break;
  }

  const last = snake[snake.length - 1];
  snake.push([ last[0] + dir[0], last[1] + dir[1] ]);
}, 250);

// Gere l'evenement keydown pour faire changer le serpent de direction
window.addEventListener('keydown', function(e) {
  console.log(e.key);
  switch (e.key) {
    case 'ArrowUp':
      direction = 0;
      break;

    case 'ArrowRight':
      direction = 1;
      break;

    case 'ArrowDown':
      direction = 2;
      break;

    case 'ArrowLeft':
      direction = 3;
      break;

    default:
      break;
  }
}, false);

function redraw() {
  var i;

  for (i = 0; i < 255; ++i) {
    ctx.fillStyle = (i % 2 === 0) ? "#9AC2C9" : "#B9D8C2";
    ctx.fillRect(i % 17 * 32, Math.floor(i / 17) *32 , 32, 32);
  }

  for (i = 0; i < snake.length; ++i) {
    const [ x, y ] = snake[i];

    ctx.fillStyle = '#FFCB47';
    ctx.fillRect(x * 32, y * 32, 32, 32);
  }

  window.requestAnimationFrame(redraw);
}


redraw();
