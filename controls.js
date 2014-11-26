/**
controls.js
*/

function initEventHandlers(canvas, currentAngle) {
  var dragging = false;         // Dragging or not
  var lastX = -1, lastY = -1;   // Last position of the mouse

  canvas.onmousedown = function(ev) {   // Mouse is pressed
    var x = ev.clientX, y = ev.clientY;
    // Start dragging if a moue is in <canvas>
    var rect = ev.target.getBoundingClientRect();
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      lastX = x; lastY = y;
      dragging = true;
    }
  };

  $(window).keypress(function(ev) {
    switch(String.fromCharCode(ev.charCode)) {
      case "w": //w
      	w_press();
      case "s": //s
      	s_press();
      case "a": //a
      	a_press();
      case "d": //d
      	d_press();
    }
  }
}

function w_press() {

}