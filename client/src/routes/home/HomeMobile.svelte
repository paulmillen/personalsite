<script>
  import { onMount, onDestroy } from "svelte";
  import { Link } from "svelte-routing";
  import * as THREE from "three";
  import TWEEN from "@tweenjs/tween.js";
  import aboutImage from "assets/person.png";
  import webImage from "assets/web.png";
  import moreImage from "assets/more.png";

  onMount(() => {
    init();
    animate();
  });

  onDestroy(() => {
    window.removeEventListener("touchstart", handleBoxTouchStart, false);
    window.removeEventListener("touchmove", handleBoxTouchMove, false);
  });

  let threeContainer,
    halfContainerWidth,
    camera,
    scene,
    boxGeometry,
    aboutTexture,
    webTexture,
    moreTexture,
    boxMaterial,
    group,
    box,
    line,
    renderer,
    mouseX = 0,
    mouseXOnMouseDown = 0,
    targetRotation = 0,
    targetRotationOnTouchStart = 0;

  function handleBoxTouchStart(event) {
    if (event.touches.length === 1) {
      mouseXOnMouseDown = event.touches[0].pageX - halfContainerWidth;
    }
  }

  function handleBoxTouchMove(event) {
    if (event.touches.length === 1) {
      mouseX = event.touches[0].pageX - halfContainerWidth;

      if (mouseX - mouseXOnMouseDown > 100) {
        new TWEEN.Tween(group.rotation)
          .to({ y: group.rotation.y + Math.PI / 2 }, 400)
          .easing(TWEEN.Easing.Cubic.In)
          .start();
      } else if (mouseX - mouseXOnMouseDown < -100) {
        new TWEEN.Tween(group.rotation)
          .to({ y: group.rotation.y - Math.PI / 2 }, 400)
          .easing(TWEEN.Easing.Cubic.In)
          .start();
      }
    }
  }

  function init() {
    window.addEventListener("touchstart", handleBoxTouchStart, false);
    window.addEventListener("touchmove", handleBoxTouchMove, false);

    threeContainer = document.getElementById("three");
    halfContainerWidth = threeContainer.clientWidth / 2;

    camera = new THREE.PerspectiveCamera(
      70,
      threeContainer.clientWidth / threeContainer.clientHeight,
      0.01,
      10
    );
    camera.position.set(0, 0, 1.1);

    const loader = new THREE.TextureLoader();
    aboutTexture = loader.load(aboutImage);
    webTexture = loader.load(webImage);
    moreTexture = loader.load(moreImage);

    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color("white");

    // light
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(0, 50, 30);
    scene.add(light);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.3);
    light2.position.set(0, 5, 60);
    scene.add(light2);

    group = new THREE.Group();
    scene.add(group);

    // box
    boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    boxMaterial = new THREE.MeshBasicMaterial({ color: 0xaf0000 });
    box = new THREE.Mesh(boxGeometry, boxMaterial);
    group.add(box);

    // edges
    var edges = new THREE.EdgesGeometry(boxGeometry);
    line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    group.add(line);

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
    threeContainer.appendChild(renderer.domElement);
  }

  function update(time) {}

  function render() {
    renderer.render(scene, camera);
  }

  function animate(time) {
    time *= 0.0004;
    TWEEN.update();
    requestAnimationFrame(animate);
    update(time);
    render();
  }
</script>

<style>
  :global(a) {
    color: burlywood;
  }

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .three-container {
    flex: 1;
    width: 100%;
  }

  .text-container {
    flex: 1;
    border: 3px solid black;
    border-radius: 5px;
    width: 98%;
    font-family: "Jaldi", Helvetica, sans-serif;
    font-size: 10vw;
    background-color: #af0000;
    color: #ffffee;
  }
</style>

<svelte:head>
  <link href="https://fonts.googleapis.com/css?family=Jaldi" rel="stylesheet" />
</svelte:head>
<div class="container">
  <div class="text-container">
    <p>SOME TEXT</p>
  </div>
  <div class="three-container" id="three" />
</div>
