const THREE = require('three');
const { vertexShader, fragmentShader } = require('./shaders');

const helloWorld = () => {
  console.log(`👼 exodus-js
    Created by Andrzej Lichnerowicz (http://twitter.com/unjello/)
    Audio by Jakub Argasiński (http://twitter.com/argasek)`);
};

let uniforms = {};
let renderer, scene, camera, sound;

const renderScene = () => {
  uniforms.time.value = sound.context.currentTime - sound.startTime;
  renderer.render(scene, camera);
};

const animate = () => {
  renderScene();
  window.requestAnimationFrame(animate);
};

const start = () => {
  sound.play();
  window.requestAnimationFrame(animate);
};

const initThreeJs = () => {
  const canvas = document.getElementById('canvas');
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  camera = new THREE.Camera();
  camera.position.z = 1;
  scene = new THREE.Scene();
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

  window.addEventListener('resize', () => {
    const canvas = document.getElementById('canvas');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height);
  }, false);

  const listener = new THREE.AudioListener();
  sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load('music.ogg', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(1.0);
    start();
  });
};

const createApp = () => {
  helloWorld();
  initThreeJs();
};

createApp();
