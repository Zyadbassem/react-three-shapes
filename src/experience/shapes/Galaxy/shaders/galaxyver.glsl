attribute float speed;
attribute vec3 color;
varying vec3 vColor;
uniform float u_time;

void main()
{
    vColor = color;
    vec3 newPosition = vec3(position.x + (sin(u_time * speed) * 0.2), position.y, position.z  + (cos(u_time  * speed) * 0.2));
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);
    gl_PointSize = 1.0;
}
