/**
draw.js
*/

function initCube(element){
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  var vertices = new Float32Array([   // Vertex coordinates
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
  ]);
  var normals = new Float32Array([   // Normal coordinates
     0.0, 0.0, 1.0, 0.0,  0.0, 0.0, 1.0,0.0,  0.0,0.0, 1.0,0.0,   0.0,0.0, 1.0,0.0,  // v0-v1-v2-v3 front
     1.0, 0.0, 0.0,0.0,   1.0,0.0, 0.0,0.0,   1.0,0.0,0.0,0.0,   1.0, 0.0,0.0,0.0,  // v0-v3-v4-v5 right
     0.0, 1.0, 0.0,0.0,   0.0, 1.0,0.0,0.0,  0.0, 1.0,0.0,0.0,  0.0, 1.0, 0.0,0.0,  // v0-v5-v6-v1 up
    -1.0, 0.0, 0.0,0.0,   -1.0,0.0, 0.0,0.0,   -1.0,0.0,0.0, 0.0,  -1.0, 0.0,0.0,0.0,  // v1-v6-v7-v2 left
    0.0, -1.0, 0.0,0.0,   0.0, -1.0,0.0,0.0,  0.0, -1.0,0.0,0.0,  0.0, -1.0, 0.0,0.0,  // v7-v4-v3-v2 down
     0.0, 0.0, -1.0,0.0,  0.0, 0.0, -1.0,0.0,  0.0,0.0, -1.0,0.0,   0.0,0.0, -1.0, 0.0  // v4-v7-v6-v5 back
  ]);
  
  var BLACK=new Float32Array([0.0, 0.0, 0.0]);
  
  var indicesTemp = [];
  var colors = new Float32Array(6*4*3);
  for(i=0; i<6; i++){
    
    var faceColor= element.build_colors[i];
    
    if(null!=faceColor){
      indicesTemp.push(i*4);
      indicesTemp.push(i*4+1);
      indicesTemp.push(i*4+2);
      
      indicesTemp.push(i*4);
      indicesTemp.push(i*4+2);
      indicesTemp.push(i*4+3);
    } else {
      faceColor=BLACK;
    }
      
        
    for(j=0; j<4; j++){
      for(k=0; k<3; k++){
        colors[k+3*j+4*3*i]=faceColor[k];
      }	
    }
  }
  
  var indices = new Uint8Array(indicesTemp);
  
  element.indices = indices;
  element.normals = normals;
  element.shader_colors = colors;
  element.vertices = vertices;
  initMdlMatrix(element);
}

function initMdlMatrix(element){
  var mdlMatrixChild = new Matrix4();
  if(element.is_static){
    mdlMatrixChild.translate(element.pos[0], element.pos[1], element.pos[2]);
    mdlMatrixChild.scale(element.scale[0], element.scale[1], element.scale[2]);
    element.mdl_matrix = mdlMatrixChild;
    element.nmdl_matrix = getInverseTranspose(mdlMatrixChild);
  }
}

function drawCube(gl, element) {

  // Create a buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) 
    return -1;

  // Write the vertex coordinates and color to the buffer object
  if (!initArrayBuffer(gl, element.vertices, 3, gl.FLOAT, 'a_Position'))
    return -1;

  if (!initArrayBuffer(gl, element.shader_colors, 3, gl.FLOAT, 'a_Color'))
    return -1;
	
  if (!initArrayBuffer(gl, element.normals, 4, gl.FLOAT, 'a_Normal'))
    return -1;

  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, element.indices, gl.STATIC_DRAW);
  
  // Get the storage location of u_NormalDirection
  var u_NormalDirection = gl.getUniformLocation(gl.program, 'u_NormalDirection');
  if (!u_NormalDirection) {
    console.log('Failed to get the storage location of u_NormalDirection');
    return;
  }
  
  gl.uniform1f(u_NormalDirection, element.normal_dir);

   // Draw the cube
  gl.drawElements(gl.TRIANGLES, element.indices.length, gl.UNSIGNED_BYTE, 0);
}

function drawPlaneObj(gl, planeColors, normalDirection) {
	var vertices = new Float32Array([   // Vertex coordinates
     1.0, 0.0, 0.0,  -0.5, 0.5, 0.0,  -1.0, 0.0, 1.0, //Front Left
     1.0, 0.0, 0.0,  -1.0, 0.0,-1.0,  -0.5, 0.5, 0.0, //Front Right
    -1.0, 0.0, 1.0,  -0.5, 0.0, 0.0,  -0.5, 0.5, 0.0, //Back Left
    -1.0, 0.0,-1.0,  -0.5, 0.0, 0.0,  -0.5, 0.5, 0.0, //Back Right
     1.0, 0.0, 0.0,  -1.0, 0.0, 1.0,  -0.5, 0.0, 0.0, //Bottom Left
     1.0, 0.0, 0.0,  -1.0, 0.0,-1.0,  -0.5, 0.0, 0.0 //Bottom Right
  ]);

  if(!planeDrawn) {
  	planeNs = getNormalsFromVertices(vertices, 3, 6);
  	planeCs = new Float32Array(6*3*3);

  	var BLACK=new Float32Array([0.0, 0.0, 0.0]);
  	var indicesTemp = [];
  	
  	for(i=0; i<6; i++){
      
      var faceColor=planeColors[i];

    	if(null!=faceColor){
    		indicesTemp.push(i*3);
    		indicesTemp.push(i*3+1);
    		indicesTemp.push(i*3+2);
    	} else {
    		faceColor=BLACK;
    	}
    			
    	for(j=0; j<3; j++){
    		for(k=0; k<3; k++){
    			planeCs[k+3*j+3*3*i]=faceColor[k];
    		}		
    	}
  	}
    planeIs = new Uint8Array(indicesTemp);
    planeDrawn = true;
  }

  
  
  // Create a buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) 
    return -1;

  // Write the vertex coordinates and color to the buffer object
  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position'))
    return -1;

  if (!initArrayBuffer(gl, planeCs, 3, gl.FLOAT, 'a_Color'))
    return -1;
	
  if (!initArrayBuffer(gl, planeNs, 4, gl.FLOAT, 'a_Normal'))
    return -1;

  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, planeIs, gl.STATIC_DRAW);
  
  // Get the storage location of u_NormalDirection
  var u_NormalDirection = gl.getUniformLocation(gl.program, 'u_NormalDirection');
  if (!u_NormalDirection) {
    console.log('Failed to get the storage location of u_NormalDirection');
    return;
  }
  
  gl.uniform1f(u_NormalDirection, normalDirection);

   // Draw the cube
  gl.drawElements(gl.TRIANGLES, planeIs.length, gl.UNSIGNED_BYTE, 0);
}

function drawHUD(ctx, gaze, pl_pos, speed, text, deaths, kills){
  ctx.clearRect(0, 0, 800, 600); // Clear <hud>
  // Draw fps
  ctx.font = '18px "Times New Roman"';
  ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // Set white to the color of letters
  ctx.fillText(text, 360, 580);
  
  ctx.fillText("Kills: " + kills, 120, 580);
  ctx.fillText("Deaths: " + deaths, 220, 580);
  
  //draw radar
  var xPos = 730; //position of the center of the radar
  var yPos = 530;
  var width = 100;
  var height = 100;
  
  ctx.fillStyle = 'rgba(0, 20, 0, 1)'; // Set white to the color of letters
  ctx.beginPath();
  ctx.arc(xPos, yPos, width/2, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
  
  //draw compass
  var dir = new Float32Array([gaze[0], 0.0, gaze[2]]);
  dir = scaleVec(normalizeVec(dir), 30);

  ctx.beginPath();
  ctx.moveTo(xPos, yPos);
  ctx.lineTo(xPos + dir[0], yPos - dir[2]);
  ctx.closePath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
  ctx.stroke();

  dir = subVec(pl_pos, eye);
  dir = scaleVec(dir, 0.3);
  ctx.beginPath();
  ctx.moveTo(xPos, yPos);
  ctx.lineTo(xPos + dir[0], yPos - dir[2]);
  ctx.closePath();
  ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
  ctx.stroke();
  
  //draw crosshair
  var crossRad = 30.0;
  var innerRad = 10.0;
  var posX = 400.0;
  var posY = 300.0;

  ctx.strokeStyle = 'rgba(255, 255, 255, 1)';

  ctx.beginPath();
  ctx.moveTo(posX, posY + innerRad);
  ctx.lineTo(posX, posY + crossRad);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(posX, posY - innerRad);
  ctx.lineTo(posX, posY - crossRad);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(posX - innerRad, posY);
  ctx.lineTo(posX - crossRad, posY);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(posX + innerRad, posY);
  ctx.lineTo(posX + crossRad, posY);
  ctx.closePath();
  ctx.stroke();
  
  //draw throttle
  var posXSpd = 20.0; 
  var posYSpd = 480.0; 
  var heightSpd = 100.0;
  var widthSpd = 40.0;

  //black square
  ctx.fillStyle = 'rgba(0, 0, 0, 1)'; // Set white to the color of letters
  ctx.fillRect(posXSpd, posYSpd, widthSpd, heightSpd);

  ctx.fillStyle = 'rgba(255, 123, 0, 1)';
  ctx.fillRect(posXSpd + 2, posYSpd + (height - height * speed/max_spd_fac) + 2, widthSpd - 4, heightSpd * speed/max_spd_fac - 4);
}
