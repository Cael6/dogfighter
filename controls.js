/**
controls.js
*/

var dRot = 3;

var w_down = false;
var s_down = false;
var a_down = false;
var d_down = false;
var up_down = false;
var down_down = false;
var left_down = false;
var right_down = false;

function initEventHandlers() {
  $(window).keydown(function(ev) {
    switch(ev.keyCode) {
      case 87: //w
      	w_press();
      	break;
      case 83: //s
      	s_press();
      	break;
      case 65: //a
      	a_press();
      	break;
      case 68: //d
      	d_press();
      	break;
      case 40: //Down
      	down_press();
      	break;
      case 38: //up
      	up_press();
      	break;
      case 37: //left
      	left_press();
      	break;
      case 39: //right
      	right_press();
      	break;
    }
  });
  $(window).keyup(function(ev) {
    switch(ev.keyCode) {
      case 87: //w
      	w_down = false;
      	break;
      case 83: //s
      	s_down = false;
      	break;
      case 65: //a
      	a_down = false;
      	break;
      case 68: //d
      	d_down = false;
      	break;
      case 40: //Down
      	down_down = false;
      	break;
      case 38: //up
      	up_down = false;
      	break;
      case 37: //left
      	left_down = false;
      	break;
      case 39: //right
      	right_down = false;
      	break;
    }
  });
}

function w_press() {
	//Increase throttle
}

function s_press() {
	//Decrease throttle
}

var transformation = new Matrix4();
function a_press() {
	//Roll left (Change up vector)
	if(!a_down) {
		a_down = true;
		a_step();
	}
}

function a_step() {
	transformation.setIdentity();
	transformation.rotate(dRot, gaze[0], gaze[1], gaze[2]);
	up_vec = getTransformedFloat32Array(transformation, up_vec);
	if(a_down) {
		setTimeout(a_step, 50);
	}
}

function d_press() {
	//Roll right (Change up vector)
	var transformation = new Matrix4();
	transformation.setIdentity();
	transformation.rotate(-dRot, gaze[0], gaze[1], gaze[2]);
	up_vec = getTransformedFloat32Array(transformation, up_vec);
}

function up_press() {
	//shift gaze down (compared to up vector)

}

function down_press() {
	//shift gaze up (campared to up vector)
}

function left_press() {
	//shift gaze left
}

function right_press() {
	//shift gaze right
}