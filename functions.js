function getTransformedFloat32Array(matrix, array) {
  var newArray = new Float32Array(3);
  for(var i = 0; i < 4; i++) {
    newArray[i] = matrix.elements[i*4] * array[0]
      + matrix.elements[i*4 + 1] * array[1]
      + matrix.elements[i*4 + 2] * array[2]
      + matrix.elements[i*4 + 3] * 1;
  }
  return newArray;
}

function normalizeVec(vector) {
  var new_vec = new Float32Array(3);
  var length = Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2) + Math.pow(vector[2], 2));
  if(length !== 0){
    for(var i = 0; i < 3; i++) {
      new_vec[i] = vector[i]/length;
    }
  } else {
    for(var i = 0; i < 3; i++) {
      new_vec[i] = 0.0;
    }
  }
  return new_vec;
}

function dotProduct(vec1, vec2){
  return vec1[0]*vec2[0] + vec1[1]*vec2[1] + vec1[2]*vec2[2];
}

function vecLength(vec){
  return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
}

function angleBetween(vec1, vec2){
  var dot = dotProduct(vec1, vec2);
  var productLength = vecLength(vec1) * vecLength(vec2);
  if(productLength != 0.0){
    return Math.acos(dot/productLength)*(180/Math.PI);
  } else {
    return 0.0;
  }
}

function crossProduct(vec1, vec2) {
  var new_vec = new Float32Array(3);
  new_vec[0] = vec1[1]* vec2[2] - vec1[2] * vec2[1];
  new_vec[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
  new_vec[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
  return new_vec;
}

function getNormalsFromVertices(vertices, row_size, row_count) {
	var normals = new Float32Array(vertices.length + row_size * row_count);

	var v1 = new Float32Array(3);
	var v2 = new Float32Array(3);
	for(var i = 0; i < row_count; i++) {
		v1[0] = vertices[i*row_size + 3] - vertices[i*row_size];
		v1[1] = vertices[i*row_size + 4] - vertices[i*row_size + 1];
		v1[2] = vertices[i*row_size + 5] - vertices[i*row_size + 2];
		v2[0] = vertices[i*row_size + 6] - vertices[i*row_size];
		v2[1] = vertices[i*row_size + 7] - vertices[i*row_size + 1];
		v2[2] = vertices[i*row_size + 8] - vertices[i*row_size + 2];
		var cp = crossProduct(v2, v1);
		for(var j = 0; j < row_size; j++) {
			for(var k = 0; k < 3; k++) {
				normals[i*row_size * 4 + j * 4 + k] = cp[k];
			}
			normals[i*row_size * 4 + j * 4 + 4] = 0.0;
		}
	}
	return normals;
}

function addVec(vec1, vec2) {
  return new Float32Array([vec1[0] + vec2[0], vec1[1] + vec2[1], vec1[2] + vec2[2]]);
}

function subVec(vec1, vec2) {
  return new Float32Array([vec1[0] - vec2[0], vec1[1] - vec2[1], vec1[2] - vec2[2]]);
}

function scaleVec(vec, scale){
  return new Float32Array([vec[0] * scale, vec[1] * scale, vec[2] * scale]);
}

function getLookAtTrans(pos1, pos2) {
  var w = subVec(pos2, pos1);
  w = normalizeVec(w);
  
  var t;
  if(w[1] == w[2] && w[1] == 0 ) {
    t = addVec(w, new Float32Array([0.0,1.0,0.0]));
  } else {
    t = addVec(w, new Float32Array([1.0,0.0,0.0]));
  }
  
  var u = normalizeVec(crossProduct(t,w));
  var v = normalizeVec(crossProduct(u,w));
  
  if(w[2] > 0) {
    u = subVec(new Float32Array([0.0,0.0,0.0]), u);
  }
  
  var trans = new Matrix4();
  trans.elements[0] = w[0];
  trans.elements[1] = w[1];
  trans.elements[2] = w[2];
  trans.elements[3] = 0.0;
  trans.elements[4] = u[0];
  trans.elements[5] = u[1];
  trans.elements[6] = u[2];
  trans.elements[7] = 0.0;
  trans.elements[8] = v[0];
  trans.elements[9] = v[1];
  trans.elements[10] = v[2];
  trans.elements[11] = 0.0;
  trans.elements[12] = 0.0;
  trans.elements[13] = 0.0;
  trans.elements[14] = 0.0;
  trans.elements[15] = 1.0;
  
  return trans;
}

function fireBullet() {
  playSound('fire');
  gaze = normalizeVec(gaze);
  var new_bullet = clone(bullet);
  new_bullet.pos = new Float32Array([eye[0], eye[1], eye[2]]);
  new_bullet.dir = new Float32Array([gaze[0], gaze[1], gaze[2]]);
  bullets[bullets.length] = new_bullet;
}

function clone(obj) {
  if (null == obj || "object" != typeof obj) {
    return obj;
  }
  var copy = obj.constructor();
  for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = obj[attr];
      }
  }
  return copy;
}

function lineCollidesWithSphere(origin, direction, sphereCenter, sphereRadius) {
  var oMinusC = subVec(origin, sphereCenter);
  var delta = dotProduct(direction, oMinusC) - Math.pow(vecLength(oMinusC), 2) + Math.pow(sphereRadius,2);
  return delta >=0;
}

// function lineCollidesWithSphere(position, direction, sphereCenter, sphereRadius) {
//   var secondPos = addVec(position, direction);
//   var a = Math.pow(secondPos[0] - position[0], 2) + Math.pow(secondPos[1] - position[1], 2) + Math.pow(secondPos[2] - position[2], 2);
//   var b = 2 * (
//                 (secondPos[0] - position[0]) * (position[0] - sphereCenter[0]) 
//                 + (secondPos[1] - position[1]) * (position[1] - sphereCenter[1])
//                 + (secondPos[2] - position[2]) * (position[2] - sphereCenter[2])
//               );
//   var c = Math.pow(position[0]-sphereCenter[0], 2) + Math.pow(position[0]-sphereCenter[0], 2) + Math.pow(position[0]-sphereCenter[0], 2) - Math.pow(sphereRadius, 2);

//   var delta = Math.pow(b,2) - 4 * a * c;

//   return delta >= 0;
// }

function checkBulletCollideWithPlane(bullet, now) {
  bullet.dir = normalizeVec(bullet.dir);
  if(lineCollidesWithSphere(bullet.pos, bullet.dir, pl_pos, 5.0)) {
    return true;
  }
}

function killEnemy(){
  playSound('crash');
  kills++;
  enemySpawn();
}

function enemySpawn(){
  var rand_disp = new Float32Array([eye[0] + (Math.floor(Math.random() + 0.5) * -2 + 1) * (Math.random() * 20 + 20), 
                                    Math.max(eye[1] +  (Math.floor(Math.random() + 0.5) * -2 + 1) * (Math.random() * 20), 5), 
                                    eye[2] + (Math.floor(Math.random() + 0.5) * -2 + 1) * (Math.random() * 20 + 20)
                                  ]);
  pl_pos = rand_disp;
}

function die() {
  playSound('crash');
  eye = init_eye;
  gaze = init_gaze;
  up_vec = init_up;
  speed_fac = init_speed_fac;
  deaths++;
  enemySpawn();
}

function playSound(id) {
  var sound = document.getElementById(id);
  if(sound.duration > 0 && !sound.paused) {
    sound.pause();
    sound.currentTime = 0;
    sound.play();
  } else {
    sound.play();
  }
}