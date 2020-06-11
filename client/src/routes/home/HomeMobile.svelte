<script>
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
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

  const ICON_BASE_OPACITY = 0.7;
  const TEXT_PANEL_TRANSITION = 200;

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
    iconGeometry,
    aboutImagePlane,
    webImagePlane,
    moreImagePlane,
    renderer,
    swipePosition = 0,
    mouseX = 0,
    mouseXOnMouseDown = 0,
    targetRotation = 0,
    targetRotationOnTouchStart = 0,
    rotateGroupRightTween,
    rotateGroupLeftTween;

  $: selectedHtmlPanel = ["more", "about", "web"][swipePosition + 1];

  function handleBoxTouchStart(event) {
    if (event.touches.length === 1) {
      mouseXOnMouseDown = event.touches[0].pageX - halfContainerWidth;
    }
  }

  function handleBoxTouchMove(event) {
    if (event.touches.length === 1) {
      mouseX = event.touches[0].pageX - halfContainerWidth;

      if (mouseX - mouseXOnMouseDown > 100 && group.rotation.y < 1.5) {
        if (!rotateGroupRightTween) {
          rotateGroupRightTween = new TWEEN.Tween(group.rotation)
            .to({ y: group.rotation.y + Math.PI / 2 }, 400)
            .easing(TWEEN.Easing.Cubic.In)
            .onStart(() => {
              swipePosition += 1;
            })
            .onComplete(() => {
              rotateGroupRightTween = null;
            })
            .start();
        }
      } else if (mouseX - mouseXOnMouseDown < -100 && group.rotation.y > -1.5) {
        if (!rotateGroupLeftTween) {
          rotateGroupLeftTween = new TWEEN.Tween(group.rotation)
            .onStart(() => {
              swipePosition -= 1;
            })
            .onComplete(() => {
              rotateGroupLeftTween = null;
            })
            .to({ y: group.rotation.y - Math.PI / 2 }, 400)
            .easing(TWEEN.Easing.Cubic.In)
            .start();
        }
      }
    }
  }

  function boxBobbing(time) {
    const interpolationFactor = -Math.abs(Math.sin(time - 0.06));

    group.position.x =
      0.22 + THREE.MathUtils.lerp(-0.06, 0.06, interpolationFactor);
    group.position.y =
      0.2 + THREE.MathUtils.lerp(-0.06, 0.06, interpolationFactor);
    group.rotation.x =
      0.4 + THREE.MathUtils.lerp(-0.08, 0.2, interpolationFactor * 2);
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
    camera.position.set(0, 0.1, 1.1);
    camera.rotation.y = -0.1;

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

    group = new THREE.Group();
    scene.add(group);

    // box
    boxGeometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);
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

    iconGeometry = new THREE.PlaneGeometry(0.3, 0.3, 10, 10);

    // icon planes
    aboutImagePlane = new THREE.Mesh(
      iconGeometry,
      new THREE.MeshBasicMaterial({
        map: aboutTexture,
        transparent: true,
        opacity: ICON_BASE_OPACITY
      })
    );

    aboutImagePlane.position.set(0, 0, 0.255);
    group.add(aboutImagePlane);

    webImagePlane = new THREE.Mesh(
      iconGeometry,
      new THREE.MeshBasicMaterial({
        map: webTexture,
        transparent: true,
        opacity: ICON_BASE_OPACITY
      })
    );

    webImagePlane.position.set(-0.3, 0, 0);
    webImagePlane.rotation.y = THREE.Math.degToRad(-90);
    group.add(webImagePlane);

    moreImagePlane = new THREE.Mesh(
      iconGeometry,
      new THREE.MeshBasicMaterial({
        map: moreTexture,
        transparent: true,
        opacity: ICON_BASE_OPACITY
      })
    );

    moreImagePlane.position.set(0.3, 0, 0);
    moreImagePlane.rotation.y = THREE.Math.degToRad(90);
    group.add(moreImagePlane);

    renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
    threeContainer.appendChild(renderer.domElement);
  }

  function update(time) {
    boxBobbing(time);
  }

  function render() {
    renderer.render(scene, camera);
  }

  function animate(time) {
    time *= 0.0004;
    TWEEN.update();
    update(time);
    requestAnimationFrame(animate);
    render();
  }
</script>

<style>
  :global(a) {
    color: burlywood;
  }

  .container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .three-container {
    flex: 1;
    width: 100%;
    height: 100%;
  }

  .panel-container {
    flex: 3;
    margin: 2vw 2vw 0 2vw;
    border: 3px solid black;
    border-radius: 5px;
    width: 95%;
    height: 70%;
    background-color: #af0000;
  }

  .text-container {
    font-family: "Jaldi", Helvetica, sans-serif;
    font-size: 6.5vw;
    color: #ffffee;
    padding: 1vw;
  }
</style>

<svelte:head>
  <link href="https://fonts.googleapis.com/css?family=Jaldi" rel="stylesheet" />
</svelte:head>
<div class="container">
  <div class="panel-container">
    {#if selectedHtmlPanel === 'about'}
      <div
        class="text-container"
        transition:fade={{ duration: TEXT_PANEL_TRANSITION }}>
        <p>
          <strong>Hello</strong>
        </p>
        <p>My name is Paul and I am a software engineer based in London.</p>
        <p>I do a lot of front-end with React, Vue and Svelte.</p>
        <p>
          But I do the occasional bit of back-end as well and I'm always keen to
          learn more.
        </p>
      </div>
    {/if}
    {#if selectedHtmlPanel === 'web'}
      <div
        class="text-container"
        transition:fade={{ duration: TEXT_PANEL_TRANSITION }}>
        <p>
          <strong>Stuff I'm working on...</strong>
        </p>
        <p>This is something I built to help me learn French:</p>
        <Link to="verb-whale">Verb Whale</Link>
        <p>Other things will go here when they're finished...</p>
      </div>
    {/if}
    {#if selectedHtmlPanel === 'more'}
      <div
        class="text-container"
        transition:fade={{ duration: TEXT_PANEL_TRANSITION }}>
        <span>
          <p style="margin-bottom: 0;">
            <strong>What else...</strong>
          </p>
          <p style="margin-top: 2vw;">
            Before I became a developer I was a sound guy for TV and film, and a
            sound designer for theatre.
          </p>
          <p>
            Checkout my
            <a href="https://github.com/paulmillen/cv-small">CV</a>
            on Github if you're interested.
          </p>
          <div class="divider" />
          <p>I enjoy distance running and film and digital photography.</p>
          <p>
            Let me bore you with some
            <a href="https://www.flickr.com/photos/nmtm">photos...</a>
          </p>
        </span>
      </div>
    {/if}
  </div>
  <div class="three-container" id="three" />
</div>
