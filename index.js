var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var snake;
var direction;
var objLoaded = false;
var initialLength;
var score;
var objPos = [ 10, 10 ];
let isGameOver = false;
let directionChanged = false;

var objImage = new Image();
objImage.onload = function() {
  objLoaded = true;
}
objImage.src = 'obj.png';

resetGame();

function isInSnake(x, y) {
  var i;

  for (i = 0; i < snake.length; ++i) {
    if (snake[i][0] === x && snake[i][1] === y) {
      return true;
    }
  }

  return false;
}

function isWallBang() {
  const last = snake[snake.length - 1];

  if (last[0] < 0 || last[1] < 0 || last[0] >= 17 || last[1] >= 15) {
    return true;
  }

  return false;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function genObjPos() {
  var x, y;

  // TODO write a better function ?
  do {
    x = random(0, 17);
    y = random(0, 15);
  } while (isInSnake(x, y));

  objPos = [ x, y ];
}

genObjPos();

setInterval(function() {
  let dir = dirToVec(direction);

  if (isGameOver) {
    return;
  }

  if (isWallBang()) {
    isGameOver = true;
    return;
  }

  if (score + initialLength <= snake.length) {
    snake.shift();
  }

  const last = snake[snake.length - 1];
  const newHead = [ last[0] + dir[0], last[1] + dir[1] ];

  if (isInSnake(newHead[0], newHead[1])) {
    isGameOver = true;
    return;
  }

  snake.push(newHead);

  if (isInSnake(objPos[0], objPos[1])) {
    genObjPos();
    ++score;
  }

  directionChanged = false;
}, 150);

function getSnakeHead() {
  return snake[snake.length - 1];
}

function setDirection(dir) {
  const snakeDir = dirToVec(direction);

  if (directionChanged || compareVec(negateVec(snakeDir), dirToVec(dir))) {
    return;
  }

  directionChanged = true;
  direction = dir;
}

function negateVec(v) {
  return [
    -v[0],
    -v[1],
  ];
}

function compareVec(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

function dirToVec(dir) {
  switch (dir) {
    case 0:
      return [ 0, -1 ];
      break;

    case 1:
      return [ 1, 0 ];
      break;

    case 2:
      return [ 0, 1 ];
      break;

    case 3:
      return [ -1, 0 ];
      break;

    default:
      return null;
  }
}

function resetGame() {
  snake = [
    [ 0, 0 ],
    [ 1, 0 ],
    [ 2, 0 ],
  ];

  initialLength = snake.length;
  score = 0;
  direction = 1;
  isGameOver = false;
}

// Gere l'evenement keydown pour faire changer le serpent de direction
window.addEventListener('keydown', function(e) {
  console.log(e.key);
  switch (e.key) {
    case 'Enter':
      if (isGameOver) {
        resetGame();
      }
      break;

    case 'ArrowUp':
      setDirection(0);
      break;

    case 'ArrowRight':
      setDirection(1);
      break;

    case 'ArrowDown':
      setDirection(2);
      break;

    case 'ArrowLeft':
      setDirection(3);
      break;

    default:
      break;
  }
}, false);

const colors = [
  '#000000',
  '#0000AA',
  '#00AA00',
  '#00AAAA',
  '#AA0000',
  '#AA00AA',
  '#FFAA00',
  '#AAAAAA',
  '#555555',
  '#5555FF',
  '#55FF55',
  '#55FFFF',
  '#55FF55',
  '#FF5555',
  '#FFFF55',
  '#FFFFFF',
];

function renderText(text, x, y, height) {
  const lines = text.split(/\r?\n/);
  let i, metrics;

  y -= (height * lines.length) / 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  for (i = 0; i < lines.length; ++i) {
    metrics = ctx.measureText(lines[i]);
    ctx.fillText(lines[i], x, y);
    y += height;
  }

  return y;
}

function renderBox(x, y, width, height, text) {
  const radius = 10;

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  ctx.fillStyle = 'orange';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 3;

  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'white';
  ctx.font = '24px Roboto';
  renderText(text, x + width / 2, y + height / 2, 24);
}

function redraw() {
  var i;

  for (i = 0; i < 255; ++i) {
    ctx.fillStyle = (i % 2 === 0) ? "#9AC2C9" : "#B9D8C2";
    ctx.fillRect(i % 17 * 32, Math.floor(i / 17) *32 , 32, 32);
  }

  for (i = 0; i < snake.length; ++i) {
    const [ x, y ] = snake[i];

    ctx.fillStyle = `rgba(255,203,71,${0.7 + (i / snake.length) * 0.3})`;
    ctx.fillRect(x * 32, y * 32, 32, 32);
  }

  ctx.fillStyle = 'white';
  if (objLoaded) {
    ctx.drawImage(objImage, objPos[0] * 32, objPos[1] * 32, 32, 32);
  } else {
    ctx.fillRect(objPos[0] * 32, objPos[1] * 32, 32, 32);
  }

  if (isGameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const w = 400, h = 400;
    renderBox((canvas.width - w) / 2, (canvas.height - h) / 2, w, h, 'Game Over\nScore: ' + score + '\n\nPress enter to play again');
  }

  window.requestAnimationFrame(redraw);
}

redraw();
