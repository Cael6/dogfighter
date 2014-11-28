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
  for(var i = 0; i < 3; i++) {
    new_vec[i] = vector[i]/length;
  }
  return new_vec;
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
		var cp = crossProduct(v1, v2);
		for(var j = 0; j < row_size; j++) {
			for(var k = 0; k < 3; k++) {
				normals[i*row_size * 4 + j * 4 + k] = cp[k];
			}
			normals[i*row_size * 4 + j * 4 + 4] = 0.0;
		}
	}
	return normals;
}