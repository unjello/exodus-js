import './main.css';
const THREE = require('three');
const tweenr = require('tweenr')();
const css = require('dom-css');
const { vertexShader, fragmentShader, fragmentShader2 } = require('./shaders');
const helloWorld = () => {
  console.log(`👼 exodus-js
    Created by Andrzej Lichnerowicz (http://twitter.com/unjello/)
    Audio by Jakub Argasiński (http://twitter.com/argasek)
      Huge thanks for splash-screen and WebGL layout inspirations to 
      Matt DesLauriers (https://twitter.com/mattdesl)
      and his audiograph project (https://github.com/mattdesl/audiograph.xyz)
      it's where portions of code, fonts and volume icon are from.`);
};

let uniforms = {};
let renderer, scene, camera, sound, startTime;

const renderScene = () => {
  uniforms.time.value = (Date.now() - startTime) /
      1000.0; // sound.context.currentTime; // - sound.startTime;
  renderer.render(scene, camera);
};

const animate = () => {
  renderScene();
  window.requestAnimationFrame(animate);
};

const start = () => {
  startTime = Date.now();
  window.requestAnimationFrame(animate);
};

const resize = () => {
  const canvas = document.getElementById('canvas');
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  renderer.setSize(width, height);
  uniforms.resolution.value.x = width;
  uniforms.resolution.value.y = height;

  renderer.setSize(width, height);
};

const initThreeJs = () => {
  const canvas = document.getElementById('canvas');

  camera = new THREE.Camera();
  camera.position.z = 1;
  scene = new THREE.Scene();
  uniforms = {
    time: { type: 'f', value: 1.0 },
    resolution: { type: 'v2', value: new THREE.Vector2() }
  };

  const material = new THREE.RawShaderMaterial(
    { uniforms, vertexShader, fragmentShader: fragmentShader2 });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
  canvas.appendChild(renderer.domElement);
  renderer.debug.checkShaderErrors = true;
  resize();
  window.addEventListener('resize', resize, false);

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

const startIntro = () => {
  const material = new THREE.ShaderMaterial(
    { uniforms, vertexShader, fragmentShader: fragmentShader });
  startTime = Date.now();
  scene.overrideMaterial = material;
  sound.play();
};

const fixIOS = () => {
  // ensure we are at top on iPhone in landscape
  // taken from audiograph.xyz by @mattdesl
  const isIOS = /(iPhone|iPad)/i.test(navigator.userAgent);
  if (isIOS) {
    const fixScroll = () => {
      setTimeout(() => {
        window.scrollTo(0, 1);
      }, 500);
    };

    fixScroll();
    window.addEventListener('orientationchange', () => {
      fixScroll();
    }, false);
  }
};

const getChildren = element => {
  const children = Array.prototype.slice.call(element.querySelectorAll('div'));
  if (children.length === 0) children.push(element);
  return children;
};

const update = ev => {
  const tween = ev.target;
  css(tween.element, { opacity: tween.opacity });
};

const animateIn = (element, opt = {}, cb = () => {}) => {
  const duration = 1.5;
  let delay = opt.delay || 0;
  element.style.display = 'block';
  const children = getChildren(element);
  children.forEach((child, i) => {
    const tween = { opacity: 0, element: child };
    update({ target: tween });
    const t = tweenr.to(tween, { delay, opacity: 1, duration, ease: 'quadOut' })
      .on('update', update);
    delay += 0.12;
    if (i === children.length - 1) {
      t.on('complete', cb);
    }
  });
};

const animateOut = (element, cb = () => {}) => {
  const duration = 1.5;
  let delay = 0;
  element.style.display = 'block';
  const children = getChildren(element).reverse();
  children.forEach((child, i) => {
    const tween = { opacity: 1, element: child };
    update({ target: tween });
    const t = tweenr.to(tween, { delay, opacity: 0, duration, ease: 'quadOut' })
      .on('update', update);
    delay += 0.5;
    if (i === children.length - 1) {
      t.on('complete', cb);
    }
  });
};

const createApp = () => {
  helloWorld();
  fixIOS();
  initThreeJs();
  const header = document.querySelector('.header-container');
  const introVolume = document.querySelector('.intro-volume');
  const introStart = document.querySelector('.intro-start');
  animateIn(header);
  animateIn(introVolume, { delay: 0.5 }, () => {
    animateOut(introVolume, () => {
      animateIn(introStart, {}, () => {
        window.addEventListener('keydown', (ev) => {
          if (ev.keyCode === 32) {
            [header, introStart, introVolume].forEach(e => {
              e.style.display = 'none';
            });
            startIntro();
            return false;
          }
        });
      });
    });
  });
};

createApp();
