var planeDrawn = false;
var planeNs = null;
var planeIs = null;
var planeCs = null;

var move_speed = 0.05;

var frame_set_dt;
var frame_count = 0;
var max_frame_count = 128;
var frame_set;

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
var SUN_YELLOW=new Float32Array([0.9, 0.8, 0.4]);
var PLANE_COLOR=new Float32Array([0.1, 0.1, 0.2]);

var sun = [0.0, 10.0, 200.0];
var sun_size = 20.0;
var sun_angle = 0.0;
var eye = new Float32Array([0.0, 6.0, 0.0]);
//var eye = new Float32Array([0.0, 130.0, 0.0]); //debug
var gaze = new Float32Array([0.0, 0.0, 1.0]);
//var gaze = new Float32Array([0.0, -1.0, 0.0]); //debug
var up_vec = new Float32Array([0.0, 1.0, 0.0]);
//var up_vec = new Float32Array([0.0, 0.0, 1.0]); //debug
var buildings = [new Float32Array([20.0, 2.5, 50.0]), new Float32Array([-30.0, 2.5, 30.0])];
var build_colours = [SILVER, SILVER];

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
  if (!initShaders(gl, 'shader-vs', 'shader-fs')) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Set the clear color and enable the depth test

  gl.clearColor(SKY_BLUE[0], SKY_BLUE[1], SKY_BLUE[2], 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.BLEND);


  var uniforms = new Array();

  // Get the storage location of u_MvpMatrix
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  if (!u_MvpMatrix) {
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  }
  uniforms['u_MvpMatrix'] = u_MvpMatrix;
  
    // Get the storage location of u_MdlMatrix
  var u_MdlMatrix = gl.getUniformLocation(gl.program, 'u_MdlMatrix');
  if (!u_MdlMatrix) {
    console.log('Failed to get the storage location of u_MdlMatrix');
    return;
  }
  uniforms['u_MdlMatrix'] = u_MdlMatrix;
  
    // Get the storage location of u_NMdlMatrix
  var u_NMdlMatrix = gl.getUniformLocation(gl.program, 'u_NMdlMatrix');
  if (!u_NMdlMatrix) {
    console.log('Failed to get the storage location of u_NMdlMatrix');
    return;
  }
  uniforms['u_NMdlMatrix'] = u_NMdlMatrix;


  var u_isSun = gl.getUniformLocation(gl.program, 'u_isSun');
  if(!u_isSun) {
    console.log('Failed to get the storage location of u_isSun');
    return;
  }
  uniforms['u_isSun'] = u_isSun;

  // Set the eye point and the viewing volume
  var mvpMatrix = new Matrix4();
  var cameraTransformations = new Matrix4();


  initEventHandlers();
  
  var tick = function(){

    mvpMatrix.setPerspective(65, 1, 1, 300);
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

    setupLight(gl, eye);
	
    var now = Date.now();
    var fps = getFPS(now);
    last = now;

    drawOcean(gl, uniforms, mdlMatrix);
    drawSun(gl, uniforms, mdlMatrix);
    drawBuildings(gl, uniforms, mdlMatrix);
    drawPlane(gl, uniforms, mdlMatrix, false);

    //own plane
    drawPlane(gl, uniforms, mdlMatrix, true);
    draw2d(ctx, "Frame Rate: " + fps.toFixed(2));
    requestAnimationFrame(tick, canvas);
  }
  tick();
}

  

function getInverseTranspose(mat4){
	m = new Matrix4();
	m.setInverseOf(mat4);
	m.transpose();
	return m;
}

function drawOcean(gl, uniforms, mdlMatrix){
  //ocean
  mdlMatrixChild=new Matrix4(mdlMatrix);
  mdlMatrixChild.scale(100.0, 1.0, 100.0);
  gl.uniformMatrix4fv(uniforms['u_MdlMatrix'], false, mdlMatrixChild.elements);
  gl.uniformMatrix4fv(uniforms['u_NMdlMatrix'], false, getInverseTranspose(mdlMatrixChild).elements);
  gl.uniform1f(uniforms['u_isSun'], 0.0);
  cubeColors=[null, null, null, null, OCEAN_BLUE, false];
  drawCube(gl, cubeColors, -1);
}

function drawSun(gl, uniforms, mdlMatrix) {
  mdlMatrixChild=new Matrix4(mdlMatrix);
  mdlMatrixChild.translate(sun[0], sun[1], sun[2]);
  mdlMatrixChild.rotate(sun_angle, 1, 1, 1);
  mdlMatrixChild.scale(sun_size, sun_size, sun_size);
  gl.uniformMatrix4fv(uniforms['u_MdlMatrix'], false, mdlMatrixChild.elements);
  gl.uniformMatrix4fv(uniforms['u_NMdlMatrix'], false, getInverseTranspose(mdlMatrixChild).elements);
  gl.uniform1f(uniforms['u_isSun'], 1.0);
  cubeColors=[null, null, null, null, null, SUN_YELLOW];
  drawCube(gl, cubeColors, -1);
}

function drawBuildings(gl, uniforms, mdlMatrix){
	for(var i=0; i<buildings.length; i++){
		mdlMatrixChild=new Matrix4(mdlMatrix);
    mdlMatrixChild.translate(buildings[i][0], buildings[i][1], buildings[i][2]);
    mdlMatrixChild.scale(1.0, 5.0, 1.0);
    gl.uniformMatrix4fv(uniforms['u_MdlMatrix'], false, mdlMatrixChild.elements);
    gl.uniformMatrix4fv(uniforms['u_NMdlMatrix'], false, getInverseTranspose(mdlMatrixChild).elements);
    gl.uniform1f(uniforms['u_isSun'], 0.0);
    cubeColors=[build_colours[i], build_colours[i], build_colours[i], build_colours[i], build_colours[i], build_colours[i]];
    drawCube(gl, cubeColors, 1);
	}
	
}

function drawPlane(gl, uniforms, mdlMatrix, isSelf) {
  if(!isSelf) {
    mdlMatrixChild=new Matrix4(mdlMatrix);
    mdlMatrixChild.translate(0.0, 4.0, 20.0);
    mdlMatrixChild.scale(3.0, 3.0, 5.0);
  } else {
    mdlMatrixChild = new Matrix4(mdlMatrix);
    mdlMatrixChild.translate(eye[0] + gaze[0]/2.0, eye[1] - gaze[1]/2, eye[2]+ gaze[2]/2.0);
    mdlMatrixChild.rotate(-90.0, 0.0, 1.0, 0.0);
    // mdlMatrixChild.lookAt(0.0, 0.0, 0.0, eye[0] + gaze[0], eye[1] + gaze[1], eye[2] + gaze[2], up_vec[0], up_vec[1], up_vec[2]);
    
    

  }
  gl.uniformMatrix4fv(uniforms['u_MdlMatrix'], false, mdlMatrixChild.elements);
  gl.uniformMatrix4fv(uniforms['u_NMdlMatrix'], false, getInverseTranspose(mdlMatrixChild).elements);
  gl.uniform1f(uniforms['u_isSun'], 0.0);
  drawPlaneObj(gl, PLANE_COLOR, 1);
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
	
	gl.uniform4f(u_Ambient, 0.4, 0.4, 0.4, 1.0);

	gl.uniform4f(u_Diffuse, 1.0, 1.0, 1.0, 1.0);
	
	gl.uniform4f(u_Specular, SUN_YELLOW[0], SUN_YELLOW[1], SUN_YELLOW[2], 1.0);
	
	gl.uniform4f(u_LightLocation, sun[0], sun[1], sun[2], 1.0);
	
	gl.uniform4f(u_eye, eye[0], eye[1], eye[2], 1.0);
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
  if(frame_count%15 == 0){
    console.log(eye);
  }
  var fps = frame_set.length/total_time * 1000;
  return fps;

}

function resetView() {
  gaze = new Float32Array([0.0, 0.0, 1.0]);
  up_vec = new Float32Array([0.0, 1.0, 0.0]);
}