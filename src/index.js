const THREE = require('three');

const helloWorld = () => {
  console.log(`👼 exodus-js
    Created by Andrzej Lichnerowicz (http://twitter.com/unjello/)
    Audio by Jakub Argasiński (http://twitter.com/argasek)`);
};

const vertexShader = `
        uniform float time;
        uniform vec2 resolution;
        void main()     {
            gl_Position = vec4( position, 1.0 );
        }
`;

const fragmentShader = `
uniform float time;
uniform vec2 resolution;
void main()     {
    vec2 uv = gl_FragCoord.xy/resolution.xy;
    vec3 col = 0.5 + 0.5*cos(time + uv.xyx + vec3(0,2,4));
    gl_FragColor= vec4(vec3(col), 1.0);
}
`;

let startTime;
let uniforms = {};
let renderer, scene, camera;

const renderScene = () => {
  const elapsedMilliseconds = Date.now() - startTime;
  const elapsedSeconds = elapsedMilliseconds / 100000;
  uniforms.time.value = 60 * elapsedSeconds;
  renderer.render(scene, camera);
};

const animate = () => {
  renderScene();
  window.requestAnimationFrame(animate);
};

const start = () => {
  window.requestAnimationFrame(animate);
};

const initThreeJs = () => {
  const canvas = document.getElementById('canvas');
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  camera = new THREE.Camera();
  camera.position.z = 1;
  scene = new THREE.Scene();
  startTime = new Date();
  uniforms = {
    time: { type: 'f', value: 1.0 },
    resolution: { type: 'v2', value: new THREE.Vector2() }
  };

  const material =
      new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
  canvas.appendChild(renderer.domElement);
  uniforms.resolution.value.x = width;
  uniforms.resolution.value.y = height;
  renderer.setSize(width, height);
  start();
};

const createApp = () => {
  helloWorld();
  initThreeJs();
};

createApp();
