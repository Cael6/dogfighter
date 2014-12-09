#ifdef GL_ES
precision mediump float;
#endif GL_ES
varying vec4 v_Color;
varying vec4 v_Position;
varying vec4 v_Normal;
uniform vec4 u_eye;
uniform vec4 u_Ambient;
uniform vec4 u_Diffuse;
uniform vec4 u_Specular;
uniform vec4 u_LightLocation;
uniform float u_isSun;
uniform float u_isPlane;
uniform float u_isBuilding;
uniform float u_isWater;
varying vec4 vLighting;

void main() {
  float nDotL = max(0.0, dot(normalize(v_Normal), normalize(u_LightLocation-v_Position)));
  float hDotL = max(0.0, dot(normalize(v_Normal), normalize(normalize(u_LightLocation-v_Position)+normalize(u_eye-v_Position))));
  vec4 lighting = (u_Ambient + u_Diffuse*nDotL + u_Specular*pow(hDotL, 256.0));


  if(u_isSun == 1.0){
    float alpha_factor = max(1.0 - sqrt(pow(v_Position.x/20.0,2.0) + pow((v_Position.y - 20.0)/20.0,2.0)),0.0);
    if(alpha_factor > 0.0) {
      gl_FragColor = v_Color*vec4(alpha_factor, alpha_factor, alpha_factor, alpha_factor);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
  } else {
    gl_FragColor = v_Color*lighting;
  }

  if(u_isPlane == 1.0){
    gl_FragColor = v_Color*lighting;
  }

  if(u_isBuilding == 1.0){
    lighting = (u_Ambient + 5.0*u_Diffuse*nDotL + u_Specular*pow(hDotL, 256.0));
    gl_FragColor = v_Color*lighting;
  }

  if(u_isWater == 1.0){
    float water_alpha = 1.0; //noise or transparency goes here
    vec4 this_Color = v_Color*vec4(water_alpha, water_alpha, water_alpha, water_alpha);
    lighting = (u_Ambient + u_Diffuse*nDotL + u_Specular*pow(hDotL, 3.0));
    gl_FragColor = this_Color*lighting;
  }
}