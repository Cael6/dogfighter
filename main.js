var planeDrawn = false;
var planeNs = null;
var planeIs = null;
var planeCs = null;
var view_distance = 400;

var move_speed = 0.05;

var deaths = 0;
var kills = 0;

var frame_set_dt;
var frame_count = 0;
var max_frame_count = 128;
var frame_set;

var game_time = 0;

var SUN_YELLOW = new Float32Array([1.0, 0.99, 0.29]);
var SKY_BLUE = new Float32Array([0.1, 0.2, 0.282]);
var OCEAN_BLUE=new Float32Array([0.1, 0.2, 0.282]);

var RED=new Float32Array([1.0, 0.0, 0.0]);
var WHITE=new Float32Array([1.0, 1.0, 1.0]);
var GRAY=new Float32Array([0.5, 0.5, 0.5]);
var SILVER=new Float32Array([1.0, 0.7, 0.7]);
var BLACK=new Float32Array([0.0, 0.0, 0.0]);

var BLUE=new Float32Array([0.0, 0.0, 1.0]);
var YELLOW=new Float32Array([1.0, 1.0, 0.0]);
var GREEN=new Float32Array([0.0, 1.0, 0.0]);

var PLANE_COLOR=new Float32Array([0.1, 0.1, 0.2]);
var BULLET_COLOR=new Float32Array([0.9, 0.9, 0.5]);
var SAND =new Float32Array([1.0, 1.0, 0.59]);


var sun_size = 20.0;
var sun_angle = 0.0;
var eye = new Float32Array([0.0, 4.0, -10.0]); //initial position
var init_eye = new Float32Array(eye);
var gaze = new Float32Array([0.0, 0.0, 1.0]); //initial gaze
var init_gaze = new Float32Array(gaze);
var up_vec = new Float32Array([0.0, 1.0, 0.0]);
var init_up = new Float32Array(up_vec);

var pl_pos = new Float32Array([0.0, 6.0, 10.0]);
var pl_dir = new Float32Array([1.0, 0.0, 0.0]);
var pl_up = new Float32Array([0.0, 1.0, 0.0]);

var engine = document.getElementById('engine'); 

var buildings = [
  {
    'pos' : new Float32Array([100.0, 3.0, 100.0]),
    'scale' : new Float32Array([2.0, 15.0, 2.0]),
    'build_colors' : [SILVER, SILVER, SILVER, SILVER, SILVER, SILVER],
    'shader_colors' : null,
    'vertices' : null,
    'normals' : null,
    'indices' : null,
    'is_static' : true,
    'mdl_matrix' : null,
    'nmdl_matrix' : null,
    'normal_dir' : 1,
    'light' : {
      'pos' : new Float32Array([100.0, 20.0, 100.0]),
      'scale' : new Float32Array([1.0, 1.0, 1.0]),
      'build_colors' : [RED, RED, RED, RED, RED, RED],
      'shader_colors' : null,
      'vertices' : null,
      'normals' : null,
      'indices' : null,
      'is_static' : true,
      'mdl_matrix' : null,
      'nmdl_matrix' : null,
      'normal_dir' : -1,
    }
  },
  {
    'pos' : new Float32Array([-100.0, 3.0, 100.0]),
    'scale' : new Float32Array([2.0, 15.0, 2.0]),
    'build_colors' : [SILVER, SILVER, SILVER, SILVER, SILVER, SILVER],
    'shader_colors' : null,
    'vertices' : null,
    'normals' : null,
    'indices' : null,
    'is_static' : true,
    'mdl_matrix' : null,
    'nmdl_matrix' : null,
    'normal_dir' : 1,
    'light' : {
      'pos' : new Float32Array([-100.0, 20.0, 100.0]),
      'scale' : new Float32Array([1.0, 1.0, 1.0]),
      'build_colors' : [RED, RED, RED, RED, RED, RED],
      'shader_colors' : null,
      'vertices' : null,
      'normals' : null,
      'indices' : null,
      'is_static' : true,
      'mdl_matrix' : null,
      'nmdl_matrix' : null,
      'normal_dir' : -1,
    }
  },
  {
    'pos' : new Float32Array([100.0, 3.0, -100.0]),
    'scale' : new Float32Array([2.0, 15.0, 2.0]),
    'build_colors' : [SILVER, SILVER, SILVER, SILVER, SILVER, SILVER],
    'shader_colors' : null,
    'vertices' : null,
    'normals' : null,
    'indices' : null,
    'is_static' : true,
    'mdl_matrix' : null,
    'nmdl_matrix' : null,
    'normal_dir' : 1,
    'light' : {
      'pos' : new Float32Array([100.0, 20.0, -100.0]),
      'scale' : new Float32Array([1.0, 1.0, 1.0]),
      'build_colors' : [RED, RED, RED, RED, RED, RED],
      'shader_colors' : null,
      'vertices' : null,
      'normals' : null,
      'indices' : null,
      'is_static' : true,
      'mdl_matrix' : null,
      'nmdl_matrix' : null,
      'normal_dir' : -1,
    }
  },
  {
    'pos' : new Float32Array([-100.0, 3.0, -100.0]),
    'scale' : new Float32Array([2.0, 15.0, 2.0]),
    'build_colors' : [SILVER, SILVER, SILVER, SILVER, SILVER, SILVER],
    'shader_colors' : null,
    'vertices' : null,
    'normals' : null,
    'indices' : null,
    'is_static' : true,
    'mdl_matrix' : null,
    'nmdl_matrix' : null,
    'normal_dir' : 1,
    'light' : {
      'pos' : new Float32Array([-100.0, 20.0, -100.0]),
      'scale' : new Float32Array([1.0, 1.0, 1.0]),
      'build_colors' : [RED, RED, RED, RED, RED, RED],
      'shader_colors' : null,
      'vertices' : null,
      'normals' : null,
      'indices' : null,
      'is_static' : true,
      'mdl_matrix' : null,
      'nmdl_matrix' : null,
      'normal_dir' : -1,
    }
  }
];

var bullet = {
  'pos' : null,
  'scale' : new Float32Array([0.1, 0.1, 0.1]),
  'build_colors' : [BULLET_COLOR, BULLET_COLOR, BULLET_COLOR, BULLET_COLOR, BULLET_COLOR, BULLET_COLOR],
  'shader_colors' : null,
  'vertices' : null,
  'normals' : null,
  'indices' : null,
  'is_static' : false,
  'mdl_matrix' : null,
  'nmdl_matrix' : null,
  'normal_dir' : 1
};

var sun = {
  'pos' : new Float32Array([eye[0], 30.0, eye[2] + view_distance - 15.0]),
  'scale' : new Float32Array([40.0, 40.0, 40.0]),
  'build_colors' : [null, null, null, null, null, SUN_YELLOW],
  'shader_colors' : null,
  'vertices' : null,
  'normals' : null,
  'indices' : null,
  'is_static' : false,
  'mdl_matrix' : null,
  'nmdl_matrix' : null,
  'normal_dir' : -1
};

var ocean = {
  'pos' : new Float32Array([0.0, 0.0, 0.0]),
  'scale' : new Float32Array([view_distance, 0.1, view_distance]),
  'build_colors' : [null, null, null, null, OCEAN_BLUE, null],
  'shader_colors' : null,
  'vertices' : null,
  'normals' : null,
  'indices' : null,
  'is_static' : true,
  'mdl_matrix' : null,
  'nmdl_matrix' : null,
  'normal_dir' : -1
};

var bullets = new Array();
var bullet_speed = 200;
var bullet_size = 0.1;

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
  if (!initShaders(gl, 'sun')) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, 'ocean')) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, 'default')) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Set the clear color and enable the depth test

  gl.clearColor(SKY_BLUE[0], SKY_BLUE[1], SKY_BLUE[2], 1.0);
  gl.enable(gl.DEPTH_TEST);
  
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  var uniforms = {
    'sun': setUpSunShader(gl),
    'default': setUpDefaultShader(gl),
    'ocean': setUpOceanShader(gl)
  }

  // Set the eye point and the viewing volume
  var mvpMatrix = new Matrix4();

  initEventHandlers();

  for(var l=0; l<buildings.length; l++){
    initCube(buildings[l]);
    buildings[l].uniforms = uniforms.default;
    initCube(buildings[l].light);
    buildings[l].light.uniforms = uniforms.default;
  }
  initCube(sun);
  sun.uniforms = uniforms.sun;
  initCube(bullet);
  bullet.uniforms = uniforms.default;
  initCube(ocean);
  ocean.uniforms = uniforms.ocean;

  engine.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
  }, false);
  engine.play();
  engine.volume = speed_fac/max_spd_fac;

  enemySpawn();
  
  var tick = function(){


    mvpMatrix.setPerspective(75, 1, 1, view_distance);
    mvpMatrix.lookAt(eye[0], eye[1], eye[2], eye[0] + gaze[0], eye[1] + gaze[1], eye[2] + gaze[2], up_vec[0], up_vec[1], up_vec[2]);
    
    sun.pos[0] = eye[0];
    sun.pos[2] = eye[2] + Math.sqrt(view_distance*view_distance - eye[1]*eye[1]) - 10.0;

    switchShaders(gl, "default");
    // Pass the model view projection matrix to u_MvpMatrix
    gl.uniformMatrix4fv(uniforms.default['u_MvpMatrix'], false, mvpMatrix.elements);

    switchShaders(gl, "ocean");
    // Pass the model view projection matrix to u_MvpMatrix
    gl.uniformMatrix4fv(uniforms.ocean['u_MvpMatrix'], false, mvpMatrix.elements);

    switchShaders(gl, "sun");
    // Pass the model view projection matrix to u_MvpMatrix
    gl.uniformMatrix4fv(uniforms.sun['u_MvpMatrix'], false, mvpMatrix.elements);

    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mdlMatrix = new Matrix4();
    mdlMatrix.setIdentity();
	
    var now = Date.now();
    var fps = getFPS(now);
    animateBullets(now);
    animateSelf(now);
    game_time += (now - last)/5000;
    last = now;

    switchShaders(gl, 'default');
    setupSunLight(gl, eye);
    setupBuildingLight(gl);

    switchShaders(gl, 'ocean');
    setupSunLight(gl, eye);
    setupBuildingLight(gl);

    switchShaders(gl, "ocean");
    gl.uniform1f(uniforms.ocean["u_Time"], game_time);
    drawCubeObj(gl, ocean);
    switchShaders(gl, "sun");
    gl.uniform4f(uniforms.sun['u_Eye'], eye[0], eye[1], eye[2], 1.0);
    gl.uniform4f(uniforms.sun['u_Size'], sun.scale[0], sun.scale[1], sun.scale[2], 1.0);
    drawCubeObj(gl, sun);
    
    switchShaders(gl, "default");
    for(var n=0; n<bullets.length; n++){
      drawCubeObj(gl, bullets[n]);
    }
    for(var b=0; b<buildings.length; b++){
      drawCubeObj(gl, buildings[b]);
      drawCubeObj(gl, buildings[b].light);
    }
    
    drawPlane(gl, uniforms.default, mdlMatrix, false);

    //draw 2d stuff
    var spd = getSpeedFac();
    drawHUD(ctx, gaze, pl_pos, spd, "Frame Rate: " + fps.toFixed(2), deaths, kills);

    if(eye[1] <= 0.2 || Math.abs(eye[0]) >= 100 || Math.abs(eye[2]) >= 100 || Math.abs(eye[1]) >= 200){
      die();
    }
    
    oppMoveTow(eye);
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

function drawPlane(gl, uniforms, mdlMatrix, isSelf) {
  mdlMatrixChild=new Matrix4(mdlMatrix);
  mdlMatrixChild.translate(pl_pos[0], pl_pos[1], pl_pos[2]);
  mdlMatrixChild.multiply(getLookAtTrans(pl_pos, eye));
  mdlMatrixChild.scale(3.0, 3.0, 5.0);
  
  
  gl.uniformMatrix4fv(uniforms['u_MdlMatrix'], false, mdlMatrixChild.elements);
  gl.uniformMatrix4fv(uniforms['u_NMdlMatrix'], false, getInverseTranspose(mdlMatrixChild).elements);
  drawPlaneObj(gl, [PLANE_COLOR, PLANE_COLOR, PLANE_COLOR, PLANE_COLOR, PLANE_COLOR, PLANE_COLOR], 1);
}

function drawCubeObj(gl, element){
  if(!element.is_static){
    var mdlMatrixChild=new Matrix4();
    mdlMatrixChild.translate(element.pos[0], element.pos[1], element.pos[2]);
    mdlMatrixChild.scale(element.scale[0], element.scale[1], element.scale[2]);
    element.mdl_matrix = mdlMatrixChild;
    element.nmdl_matrix = getInverseTranspose(mdlMatrixChild);
  }
  gl.uniformMatrix4fv(element.uniforms['u_MdlMatrix'], false, element.mdl_matrix.elements);
  gl.uniformMatrix4fv(element.uniforms['u_NMdlMatrix'], false, element.nmdl_matrix.elements);
  drawCube(gl, element);
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

function setupSunLight(gl, eye){
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
	
	gl.uniform4f(u_Ambient, 0.25, 0.25, 0.25, 1.0);

	gl.uniform4f(u_Diffuse, SUN_YELLOW[0], SUN_YELLOW[1], SUN_YELLOW[2]*2.0, 1.0);
	
	gl.uniform4f(u_Specular, SUN_YELLOW[0], SUN_YELLOW[1]*0.7, SUN_YELLOW[2]*0.3, 1.0);
	
	gl.uniform4f(u_LightLocation, sun.pos[0], sun.pos[1], sun.pos[2], 1.0);
	
	gl.uniform4f(u_eye, eye[0], eye[1], eye[2], 1.0);
}


function setupBuildingLight(gl){

  u_BuildDiffuse = gl.getUniformLocation(gl.program, 'u_BuildDiffuse');
  if (!u_BuildDiffuse) {
    console.log('Failed to get the storage location of u_BuildDiffuse');
    return;
  }
  u_BuildSpecular = gl.getUniformLocation(gl.program, 'u_BuildSpecular');
  if (!u_BuildSpecular) {
    console.log('Failed to get the storage location of u_BuildSpecular');
    return;
  }

  gl.uniform4f(u_BuildDiffuse, 1.0, 0.2, 0.2, 1.0);
  
  gl.uniform4f(u_BuildSpecular, 1.0, 0.0, 0.0, 1.0);

  for(var i = 0; i < buildings.length; i++) {
    // Get the storage location of u_LightLocation
    var u_BuildLightLoc = gl.getUniformLocation(gl.program, 'u_BuildLightLoc' + (i + 1));
    if (!u_BuildLightLoc) {
      console.log('Failed to get the storage location of u_BuildLightLoc');
      return;
    }

    gl.uniform4f(u_BuildLightLoc, buildings[i].light.pos[0],buildings[i].light.pos[1],buildings[i].light.pos[2],1.0);
  }
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
    //console.log(pl_pos);
    //console.log(eye);
  }
  var fps = frame_set.length/total_time * 1000;
  return fps;

}

function resetView() {
  gaze = new Float32Array([0.0, 0.0, 1.0]);
  up_vec = new Float32Array([0.0, 1.0, 0.0]);
}

function animateBullets(now) {
  for(var i = 0; i < bullets.length; i++) {
    if(checkBulletCollideWithPlane(bullets[i], now)) {
      killEnemy();

      for(var j = i; j < bullets.length; j++) { //shift elements of array left for all following elements and pop the last element.
        bullets[j] = bullets[j + 1];
      }
      bullets.pop();
      i--;
      break;
    }
    for(var j = 0; j < 3; j++ ) {
      bullets[i].pos[j] += (now - last)/1000 * bullet_speed * bullets[i].dir[j];
    }
    //clear bullets out of frustum
    if(
      bullets[i].pos[1] < 0.0 //bullet below sea level
      || Math.abs(vecLength(subVec(bullets[i].pos, eye))) > view_distance //bullet beyond frustrum
    ) {
      for(var j = i; j < bullets.length; j++) { //shift elements of array left for all following elements and pop the last element.
        bullets[j] = bullets[j + 1];
      }
      bullets.pop();
      i--;
    }
  }
}

function animateSelf(now) {
  gaze = normalizeVec(gaze);
  if(Math.abs(vecLength(subVec(eye, pl_pos))) < 6) {
    die();
  }
  eye = addVec(eye, scaleVec(gaze, getSpeedFac() * (now - last) / 1000));
}

function setUpDefaultShader(gl) {
  var uniforms = new Array();

  switchShaders(gl, "default");

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

  return uniforms;
}

function setUpSunShader(gl) {
  var uniforms = new Array();

  switchShaders(gl, "sun");

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
  
    // Get the storage location of u_Eye
  var u_Eye = gl.getUniformLocation(gl.program, 'u_Eye');
  if (!u_Eye) {
    console.log('Failed to get the storage location of u_Eye');
    return;
  }
  uniforms['u_Eye'] = u_Eye;
  
   // Get the storage location of u_Size
  var u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
  uniforms['u_Size'] = u_Size;
  return uniforms;
}

function setUpOceanShader(gl) {
  var uniforms = new Array();

  switchShaders(gl, "ocean");

  // Get the storage location of u_Time
  var u_Time = gl.getUniformLocation(gl.program, 'u_Time');
  if (!u_Time) {
    console.log('Failed to get the storage location of u_Time');
    return;
  }
  uniforms['u_Time'] = u_Time;

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
  return uniforms;
}

/**
function drawOcean(gl, uniforms, mdlMatrix){
  //ocean
  mdlMatrixChild=new Matrix4(mdlMatrix);
  mdlMatrixChild.scale(1000.0, 1.0, 1000.0);
  gl.uniformMatrix4fv(uniforms['u_MdlMatrix'], false, mdlMatrixChild.elements);
  gl.uniformMatrix4fv(uniforms['u_NMdlMatrix'], false, getInverseTranspose(mdlMatrixChild).elements);
  cubeColors=[null, null, null, null, OCEAN_BLUE, null];
  drawCube(gl, cubeColors, -1);
}

function drawGround(gl, uniforms, mdlMatrix){
  //ground
  mdlMatrixChild=new Matrix4(mdlMatrix);
  mdlMatrixChild.scale(1000.0, 1.0, 1000.0);
  mdlMatrixChild.translate(0.0, -3.0, 0.0);
  gl.uniformMatrix4fv(uniforms['u_MdlMatrix'], false, mdlMatrixChild.elements);
  gl.uniformMatrix4fv(uniforms['u_NMdlMatrix'], false, getInverseTranspose(mdlMatrixChild).elements);
  cubeColors=[null, null, null, null, SAND, null];
  drawCube(gl, cubeColors, -1);
}

function drawSun(gl, uniforms, mdlMatrix) {
  mdlMatrixChild=new Matrix4(mdlMatrix);
  mdlMatrixChild.translate(sun.pos[0], sun.pos[1], sun.pos[2]);
  mdlMatrixChild.rotate(sun_angle, 1, 1, 1);
  mdlMatrixChild.scale(sun_size, sun_size, sun_size);
  gl.uniformMatrix4fv(uniforms['u_MdlMatrix'], false, mdlMatrixChild.elements);
  gl.uniformMatrix4fv(uniforms['u_NMdlMatrix'], false, getInverseTranspose(mdlMatrixChild).elements);
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
    cubeColors=[build_colours[i], build_colours[i], build_colours[i], build_colours[i], build_colours[i], build_colours[i]];
    drawCube(gl, cubeColors, 1);
  }
  
}

function drawBullets(gl, uniforms, mdlMatrix){
	for(var i=0; i<bullets.length; i++){
		mdlMatrixChild=new Matrix4(mdlMatrix);
    mdlMatrixChild.translate(bullets[i].pos[0], bullets[i].pos[1], bullets[i].pos[2]);
    mdlMatrixChild.scale(bullet_size, bullet_size, bullet_size);
    gl.uniformMatrix4fv(uniforms['u_MdlMatrix'], false, mdlMatrixChild.elements);
    gl.uniformMatrix4fv(uniforms['u_NMdlMatrix'], false, getInverseTranspose(mdlMatrixChild).elements);
    cubeColors=[WHITE, WHITE, WHITE, WHITE, WHITE, WHITE];
    drawCube(gl, cubeColors, 1);
	}
	
}
**/