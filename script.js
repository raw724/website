const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('bg'),
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Torus knot shape
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshStandardMaterial({
  color: 0x00ffff,
  wireframe: true
});
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

camera.position.z = 30;

// Interaction state
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Mouse events
renderer.domElement.addEventListener('mousedown', () => {
  isDragging = true;
});
renderer.domElement.addEventListener('mouseup', () => {
  isDragging = false;
});
renderer.domElement.addEventListener('mousemove', (event) => {
  if (!isDragging) return;
  const deltaX = event.clientX - previousMousePosition.x;
  const deltaY = event.clientY - previousMousePosition.y;
  torusKnot.rotation.y += deltaX * 0.01;
  torusKnot.rotation.x += deltaY * 0.01;
  previousMousePosition = { x: event.clientX, y: event.clientY };
});
renderer.domElement.addEventListener('mouseleave', () => {
  isDragging = false;
});
renderer.domElement.addEventListener('mouseenter', (event) => {
  previousMousePosition = { x: event.clientX, y: event.clientY };
});

// Touch events
renderer.domElement.addEventListener('touchstart', (e) => {
  isDragging = true;
  previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
});
renderer.domElement.addEventListener('touchend', () => {
  isDragging = false;
});
renderer.domElement.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const touch = e.touches[0];
  const deltaX = touch.clientX - previousMousePosition.x;
  const deltaY = touch.clientY - previousMousePosition.y;
  torusKnot.rotation.y += deltaX * 0.01;
  torusKnot.rotation.x += deltaY * 0.01;
  previousMousePosition = { x: touch.clientX, y: touch.clientY };
});

function animate() {
  requestAnimationFrame(animate);
  torusKnot.rotation.z += 0.002;
  renderer.render(scene, camera);
}
animate();

// Scroll animations
const reveals = document.querySelectorAll('.reveal');
window.addEventListener('scroll', () => {
  for (let el of reveals) {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      el.classList.add('visible');
    }
  }
});

// Resize support
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
