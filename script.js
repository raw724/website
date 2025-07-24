const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('bg'),
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

camera.position.z = 40;

const group = new THREE.Group();
scene.add(group);

// Main shape
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshStandardMaterial({
  color: 0x00ffff,
  wireframe: true
});
const torusKnot = new THREE.Mesh(geometry, material);
group.add(torusKnot);

// Fragments
const fragments = [];
for (let i = 0; i < 12; i++) {
  const frag = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.MeshStandardMaterial({ color: 0xff00ff, wireframe: true })
  );
  frag.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
  frag.visible = false;
  scene.add(frag);
  fragments.push(frag);
}

// Light
const light = new THREE.PointLight(0xffffff);
light.position.set(30, 30, 30);
scene.add(light);

// Interaction
let isDragging = false;
let prev = { x: 0, y: 0 };

function dragStart(x, y) {
  isDragging = true;
  prev.x = x;
  prev.y = y;

  // trigger falling fragments
  fragments.forEach((f, i) => {
    f.visible = true;
    f.velocity = {
      x: (Math.random() - 0.5) * 0.5,
      y: (Math.random() - 0.5) * 0.5,
      z: (Math.random() - 0.5) * 0.5
    };
  });
}

function dragMove(x, y) {
  if (!isDragging) return;
  const dx = x - prev.x;
  const dy = y - prev.y;
  group.rotation.y += dx * 0.01;
  group.rotation.x += dy * 0.01;
  prev.x = x;
  prev.y = y;
}

function dragEnd() {
  isDragging = false;
}

renderer.domElement.addEventListener('mousedown', e => dragStart(e.clientX, e.clientY));
renderer.domElement.addEventListener('mousemove', e => dragMove(e.clientX, e.clientY));
renderer.domElement.addEventListener('mouseup', dragEnd);

renderer.domElement.addEventListener('touchstart', e => {
  if (e.touches.length > 0) dragStart(e.touches[0].clientX, e.touches[0].clientY);
});
renderer.domElement.addEventListener('touchmove', e => {
  if (e.touches.length > 0) dragMove(e.touches[0].clientX, e.touches[0].clientY);
});
renderer.domElement.addEventListener('touchend', dragEnd);

function animate() {
  requestAnimationFrame(animate);

  // Animate fragments
  fragments.forEach(f => {
    if (!f.visible) return;
    f.position.x += f.velocity.x;
    f.position.y += f.velocity.y;
    f.position.z += f.velocity.z;
    f.rotation.x += 0.02;
    f.rotation.y += 0.02;
  });

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
