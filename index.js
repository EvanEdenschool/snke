var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

setInterval(function() {
},50);

function redraw() {
  window.requestAnimationFrame(redraw);
}

redraw();
