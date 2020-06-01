<script>
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";
  import * as THREE from "three";

  onMount(() => {
    init();
    animate();
  });

  let renderer,
    scene,
    camera,
    baseCentre,
    baseRight,
    baseLeft,
    sphereCentre,
    sphereRight,
    sphereLeft;

  function init() {
    camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    camera.position.set(0, 0.4, 1.3);

    const loader = new THREE.TextureLoader();
    const shadowTexture = loader.load("/assets/roundshadow.png");

    scene = new THREE.Scene();
    scene.background = new THREE.Color("white");

    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(0, 50, 30);
    scene.add(light);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.3);
    light2.position.set(0, 5, 60);
    scene.add(light2);

    const sphereGeometry = new THREE.SphereGeometry(0.1, 50, 50);
    const sphereMaterial = new THREE.MeshStandardMaterial();

    const shadowGeometry = new THREE.PlaneBufferGeometry(1, 1);
    const shadowMaterial = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false
    });

    baseCentre = new THREE.Object3D();
    scene.add(baseCentre);

    const shadowMeshCentre = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadowMeshCentre.position.set(0, 0.001, -0.1);
    shadowMeshCentre.rotation.x = Math.PI * -0.5;
    shadowMeshCentre.scale.set(0.3, 0.3, 0.3);

    sphereCentre = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereCentre.position.set(0, 0.5, 0);
    baseCentre.add(sphereCentre);
    baseCentre.add(shadowMeshCentre);

    baseRight = new THREE.Object3D();
    scene.add(baseRight);

    const shadowMeshRight = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadowMeshRight.position.set(0.63, 0.001, -0.1);
    shadowMeshRight.rotation.x = Math.PI * -0.5;
    shadowMeshRight.rotation.y = -0.06;
    shadowMeshRight.scale.set(0.3, 0.3, 0.3);

    sphereRight = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereRight.position.set(0.6, 0.5, 0);
    baseRight.add(shadowMeshRight);
    baseRight.add(sphereRight);

    baseLeft = new THREE.Object3D();
    scene.add(baseLeft);

    const shadowMeshLeft = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadowMeshLeft.position.set(-0.63, 0.001, -0.1);
    shadowMeshLeft.rotation.x = Math.PI * -0.5;
    shadowMeshLeft.rotation.y = 0.06;
    shadowMeshLeft.scale.set(0.3, 0.3, 0.3);

    sphereLeft = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereLeft.position.set(-0.6, 0.5, 0);
    baseLeft.add(shadowMeshLeft);
    baseLeft.add(sphereLeft);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const threeContainer = document.getElementById("three");
    threeContainer.appendChild(renderer.domElement);
  }

  window.addEventListener("mousemove", mouseMove, false);
  const mouse = new THREE.Vector2();

  function mouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  function render() {
    var raycaster = new THREE.Raycaster();
    var intersects = [];

    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects([
      sphereCentre,
      sphereRight,
      sphereLeft
    ]);

    if (intersects.length !== 0) {
      intersects[0].object.parent.position.z = 0.2;
    } else if (intersects !== null) {
      baseCentre.position.z = 0;
      baseRight.position.z = 0;
      baseLeft.position.z = 0;
      intersects = null;
    }

    renderer.render(scene, camera);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }
</script>

<div id="three" />
