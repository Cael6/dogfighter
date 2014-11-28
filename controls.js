/**
controls.js
*/

var dRot = 4.0;
var speed_fac = 2.0;

var w_down = false;
var s_down = false;
var a_down = false;
var d_down = false;
var q_down = false;
var e_down = false;
var up_down = false;
var down_down = false;
var left_down = false;
var right_down = false;

var transformation = new Matrix4();

function initEventHandlers() {
  $(window).keydown(function(ev) {
    switch(ev.keyCode) {
      case 87: //w
		//Roll left (Change up vector)
		if(!w_down) {
			w_down = true;
			w_step();
		}
      	break;
      case 83: //s
		//Roll left (Change up vector)
		if(!s_down) {
			s_down = true;
			s_step();
		}
      	break;
      case 65: //a
		//Roll left (Change up vector)
		if(!a_down) {
			a_down = true;
			a_step();
		}
      	break;
      case 68: //d
		//Roll left (Change up vector)
		if(!d_down) {
			d_down = true;
			d_step();
		}
      	break;
      case 40: //Down
		//Roll left (Change up vector)
		if(!down_down) {
			down_down = true;
			down_step();
		}
      	break;
      case 38: //up
		//Roll left (Change up vector)
		if(!up_down) {
			up_down = true;
			up_step();
		}
      	break;
      case 37: //left
		//Roll left (Change up vector)
		if(!left_down) {
			left_down = true;
			left_step();
		}
      	break;
      case 81: //q
    if(!q_down){
      q_down = true;
      q_step();
    }
      break;
      case 69: //e
    if(!e_down){
      e_down = true;
      e_step();
    }
      break;
      case 39: //right
		//Roll left (Change up vector)
		if(!right_down) {
			right_down = true;
			right_step();
		}
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
      case 81: //q
        q_down = false;
        break;
      case 69: //e
        e_down = false;
        break;
      case 70: //f
      	resetView();
      	break;
    }
  });
}

function w_step() {
	//Increase throttle
	gaze = normalizeVec(gaze);
	for(var i = 0; i < 3; i++) {
		eye[i] = eye[i] + gaze[i] * speed_fac;
	}
	if(w_down) {
		setTimeout(w_step, 50);
	}
}

function s_step() {
	//Decrease throttle
	gaze = normalizeVec(gaze);
	for(var i = 0; i < 3; i++) {
		eye[i] = eye[i] - gaze[i] * speed_fac;
	}
	if(s_down) {
		setTimeout(s_step, 50);
	}
}

function q_step() {
	//Decrease throttle
	gaze = normalizeVec(gaze);
  var cross = crossProduct(gaze, up_vec);
	for(var i = 0; i < 3; i++) {
		eye[i] = eye[i] - cross[i] * speed_fac;
	}
	if(q_down) {
		setTimeout(q_step, 50);
  }
}

function e_step() {
	//Decrease throttle
	gaze = normalizeVec(gaze);
  var cross = crossProduct(gaze, up_vec);
	for(var i = 0; i < 3; i++) {
		eye[i] = eye[i] + cross[i] * speed_fac;
	}
	if(e_down) {
		setTimeout(e_step, 50);
  }
}

function a_step() {
	transformation.setIdentity();
	transformation.rotate(dRot, gaze[0], gaze[1], gaze[2]);
	up_vec = normalizeVec(getTransformedFloat32Array(transformation, up_vec));
	if(a_down) {
		setTimeout(a_step, 50);
	}
}

function d_step() {
	//Roll right (Change up vector)
	transformation.setIdentity();
	transformation.rotate(-dRot, gaze[0], gaze[1], gaze[2]);
	up_vec = normalizeVec(getTransformedFloat32Array(transformation, up_vec));
	if(d_down) {
		setTimeout(d_step, 50);
	}
}

function up_step() {
	//shift gaze down (change up vector)
	transformation.setIdentity();
	var right_vec = crossProduct(gaze, up_vec);
	transformation.rotate(dRot, right_vec[0], right_vec[1], right_vec[2]);
	up_vec = normalizeVec(getTransformedFloat32Array(transformation, up_vec));
	gaze = normalizeVec(getTransformedFloat32Array(transformation, gaze));
	if(up_down) {
		setTimeout(up_step, 50);
	}
}

function down_step() {
	//shift gaze up (campared to up vector)
	transformation.setIdentity();
	var right_vec = crossProduct(gaze, up_vec);
	transformation.rotate(-dRot, right_vec[0], right_vec[1], right_vec[2]);
	up_vec = normalizeVec(getTransformedFloat32Array(transformation, up_vec));
	gaze = normalizeVec(getTransformedFloat32Array(transformation, gaze));
	if(down_down) {
		setTimeout(down_step, 50);
	}
}

function left_step() {
	//shift gaze left
	transformation.setIdentity();
	transformation.rotate(-dRot, up_vec[0], up_vec[1], up_vec[2]);
	gaze = normalizeVec(getTransformedFloat32Array(transformation, gaze));
	if(left_down) {
		setTimeout(left_step, 50);
	}
}

function right_step() {
	//shift gaze right
	transformation.setIdentity();
	transformation.rotate(dRot, up_vec[0], up_vec[1], up_vec[2]);
	gaze = normalizeVec(getTransformedFloat32Array(transformation, gaze));
	if(right_down) {
		setTimeout(right_step, 50);
	}
}