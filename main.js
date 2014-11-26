// ColoredCube.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec4 a_Normal;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_MdlMatrix;\n' +
  'uniform mat4 u_NMdlMatrix;\n' +
  'uniform float u_NormalDirection;\n' +
  'varying vec4 v_Color;\n' +
  'varying vec4 v_Position;\n' +
  'varying vec4 v_Normal;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * u_MdlMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '  v_Position = u_MdlMatrix * a_Position;\n' +
  '  v_Normal = u_NormalDirection * u_NMdlMatrix *a_Normal;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE = 
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif GL_ES\n' +
  'varying vec4 v_Color;\n' +
  'varying vec4 v_Position;\n' +
  'varying vec4 v_Normal;\n' +
  'uniform vec4 u_eye;\n' +
  'uniform vec4 u_Ambient;\n' +
  'uniform vec4 u_Diffuse;\n' +
  'uniform vec4 u_Specular;\n' +
  'uniform vec4 u_LightLocation;\n' +
  'void main() {\n' +
  '  float nDotL = max(0.0, dot(normalize(v_Normal), normalize(u_LightLocation-v_Position)));\n' +
  '  float hDotL = max(0.0, dot(normalize(v_Normal), normalize(normalize(u_LightLocation-v_Position)+normalize(u_eye-v_Position))));\n' +
  '  gl_FragColor = v_Color*u_Ambient + v_Color*u_Diffuse*nDotL + v_Color*u_Specular*pow(hDotL, 256.0);\n' +
  '}\n';

var move_speed = 0.05;

var frame_set_dt;
var frame_count = 0;
var max_frame_count = 128;
var frame_set;

var sun = [10.0, 10.0, 0.0];
var eye = new Float32Array([0.0, 6.0, 0.0]);
var gaze = new Float32Array([0.0, 0.0, 1.0]);
var up_vec = new Float32Array([0.0, 1.0, 1.0]);

function main() {

  frame_set = new Array();

  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');
  //hud
  var hud = document.getElementById('hud');  

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Get the rendering context for 2DCG
  var ctx = hud.getContext('2d');
  if (!gl || !ctx) {
    console.log('Failed to get rendering context');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage location of u_MvpMatrix
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  if (!u_MvpMatrix) {
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  }
  
    // Get the storage location of u_MdlMatrix
  var u_MdlMatrix = gl.getUniformLocation(gl.program, 'u_MdlMatrix');
  if (!u_MdlMatrix) {
    console.log('Failed to get the storage location of u_MdlMatrix');
    return;
  }
  
    // Get the storage location of u_NMdlMatrix
  var u_NMdlMatrix = gl.getUniformLocation(gl.program, 'u_NMdlMatrix');
  if (!u_NMdlMatrix) {
    console.log('Failed to get the storage location of u_NMdlMatrix');
    return;
  }

  // Set the eye point and the viewing volume
  var mvpMatrix = new Matrix4();
  var cameraTransformations = new Matrix4();
  var bCubeMatrix = new Matrix4();


  initEventHandlers();

  gl.clearColor(SKY_BLUE[0], SKY_BLUE[1], SKY_BLUE[2], 1.0);
  
  var tick = function(){

    mvpMatrix.setPerspective(30, 1, 1, 100);
    mvpMatrix.lookAt(eye[0], eye[1], eye[2], eye[0] + gaze[0], eye[1] + gaze[1], eye[2] + gaze[2], up_vec[0], up_vec[1], up_vec[2]);
    //mvpMatrix.rotate(currentAngle[0], 1.0, 0.0, 0.0); // Rotation around x-axis
 
    cameraTransformations.setIdentity();
    cameraTransformations.lookAt(eye[0], eye[1], eye[2], 0, 0, 0, 0, 1, 0);

    // Pass the model view projection matrix to u_MvpMatrix
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mdlMatrix = new Matrix4();
    mdlMatrix.setIdentity();

    var new_eye = getTransformedFloat32Array(cameraTransformations, eye);

    setupLight(gl, new_eye);
	
    var now = Date.now();
    var fps = getFPS(now);
    last = now;

    drawOcean(gl, u_MdlMatrix, mdlMatrix, u_NMdlMatrix, bCubeMatrix);
    //draw2d(ctx, "Frame Rate: " + fps.toFixed(2));
    requestAnimationFrame(tick, canvas);
  }
  tick();
}

  var RED=new Float32Array([1, 0, 0]);
  var WHITE=new Float32Array([1, 1, 1]);
  var GRAY=new Float32Array([0.5, 0.5, 0.5]);
  var SILVER=new Float32Array([0.75, 0.75, 0.75]);
  var BLACK=new Float32Array([0.0, 0.0, 0.0]);
  var OCEAN_BLUE=new Float32Array([0.11, 0.42, 0.63]);
  var SKY_BLUE=new Float32Array([0.32, 0.62, 0.83]);
  var BLUE=new Float32Array([0.0, 0.0, 1.0]);
  var YELLOW=new Float32Array([1.0, 1.0, 0.0]);
  var GREEN=new Float32Array([0.0, 1.0, 0.0]);

function getInverseTranspose(mat4){
	m = new Matrix4();
	m.setInverseOf(mat4);
	m.transpose();
	return m;
}

function drawOcean(gl, u_MdlMatrix, mdlMatrix, u_NMdlMatrix, bCubeMatrix){
  //ocean
  mdlMatrixChild=new Matrix4(mdlMatrix);
  mdlMatrixChild.scale(100.0, 1.0, 100.0);
  gl.uniformMatrix4fv(u_MdlMatrix, false, mdlMatrixChild.elements);
  gl.uniformMatrix4fv(u_NMdlMatrix, false, getInverseTranspose(mdlMatrixChild).elements);
  cubeColors=[null, null, null, null, OCEAN_BLUE, null];
  drawCube(gl, cubeColors, -1);
}

function initArrayBuffer(gl, data, num, type, attribute) {
  var buffer = gl.createBuffer();   // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

function setupLight(gl, eye, u_MdlMatrix, mdlMatrix, u_NMdlMatrix){
	  
	// Get the storage location of u_Ambient
	var u_Ambient = gl.getUniformLocation(gl.program, 'u_Ambient');
	if (!u_Ambient) {
		console.log('Failed to get the storage location of u_Ambient');
		return;
	}
	
	// Get the storage location of u_Diffuse
	var u_Diffuse = gl.getUniformLocation(gl.program, 'u_Diffuse');
	if (!u_Diffuse) {
		console.log('Failed to get the storage location of u_Diffuse');
		return;
	}
	
	// Get the storage location of u_Specular
	var u_Specular = gl.getUniformLocation(gl.program, 'u_Specular');
	if (!u_Specular) {
		console.log('Failed to get the storage location of u_Specular');
		return;
	}
	
	// Get the storage location of u_LightLocation
	var u_LightLocation = gl.getUniformLocation(gl.program, 'u_LightLocation');
	if (!u_LightLocation) {
		console.log('Failed to get the storage location of u_LightLocation');
		return;
	}
	
	// Get the storage location of u_eye
	var u_eye = gl.getUniformLocation(gl.program, 'u_eye');
	if (!u_eye) {
		console.log('Failed to get the storage location of u_eye');
		return;
	}
	
	gl.uniform4f(u_Ambient, 0.2, 0.2, 0.2, 1.0);

	gl.uniform4f(u_Diffuse, 1.0, 1.0, 1.0, 1.0);
	
	gl.uniform4f(u_Specular, 1.0, 1.0, 0.5, 1.0);
	
	gl.uniform4f(u_LightLocation, sun[0], sun[1], sun[2], 1.0);
	
	gl.uniform4f(u_eye, eye[0], eye[1], eye[2], 1.0);
}

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

var last = Date.now();

function getFPS(now) {
  var elapsed = now - last;
  frame_set[frame_count % max_frame_count] = elapsed;
  frame_count++;
  var total_time = 0;
  for(var i = 0; i < frame_set.length; i++) {
    total_time += frame_set[i];
  }
  var fps = frame_set.length/total_time * 1000;
  return fps;

}

function normalizeVec(vector) {
  var length = Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2) + Math.pow(vector[2], 2));
  for(var i = 0; i < 3; i++) {
    vector[i] = vector[i]/length;
  }
  return vector[i];
}