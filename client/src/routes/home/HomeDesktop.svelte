<script>
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import { Link } from "svelte-routing";
  import * as THREE from "three";
  import TWEEN from "@tweenjs/tween.js";
  import shadowImage from "assets/roundshadow.png";
  import aboutImage from "assets/person.png";
  import webImage from "assets/web.png";
  import moreImage from "assets/more.png";

  onMount(() => {
    init();
    animate();
    mouse.x = -10;
    mouse.y = -10;
  });

  onDestroy(() => {
    window.removeEventListener("mousemove", updateMouseCoords, false);
    window.removeEventListener("click", handleMouseClick, true);
    window.removeEventListener("resize", resizeCanvasToDisplaySize, false);
  });

  let visiblePanel = null;
  let hideHeader = false;

  const mouse = new THREE.Vector2();
  const ICON_BASE_OPACITY = 0.7;
  const TARGET_ASPECT_RATIO = 16 / 9;
  const SPHERE_RADIUS = 0.1;
  const SPHERE_SEGMENTS = 50;
  const Y_ORIG_POSITION = 0.5;
  const Z_ORIG_POSITION = 0;
  const SPHERE_X_OFFSET = 0.6;
  const SPHERE_LEFT_NAME = "sphereLeft";
  const SPHERE_RIGHT_NAME = "sphereRight";
  const SPHERE_CENTRE_NAME = "sphereCentre";

  let renderer,
    threeContainer,
    scene,
    camera,
    raycaster,
    sphereGeometry,
    baseCentre,
    baseRight,
    baseLeft,
    sphereCentre,
    sphereRight,
    sphereLeft,
    intersected,
    selectedSphere,
    tween,
    opacityTween,
    geometryChangeTween,
    resetPositionTween,
    DEFAULT_ON_HOVER_RAYCAST_OBJECTS,
    onHoverRaycastObjects,
    aboutTexture,
    webTexture,
    moreTexture,
    iconGeometry,
    aboutImagePlane,
    webImagePlane,
    moreImagePlane,
    hideIconTween;

  const getAspectSize = (
    availableWidth,
    availableHeight,
    targetAspectRatio
  ) => {
    const currentRatio = availableWidth / availableHeight;
    return currentRatio > targetAspectRatio
      ? {
          width: availableHeight * targetAspectRatio,
          height: availableHeight
        }
      : {
          width: availableWidth,
          height: availableWidth / targetAspectRatio
        };
  };

  const resizeCanvasToDisplaySize = () => {
    const newDimensions = getAspectSize(
      threeContainer.clientWidth,
      threeContainer.clientHeight,
      TARGET_ASPECT_RATIO
    );
    camera.updateProjectionMatrix();

    renderer.setSize(newDimensions.width, newDimensions.height);
  };

  function updateMouseCoords(event) {
    mouse.x = (event.clientX / threeContainer.clientWidth) * 2 - 1.25;
    mouse.y = -(event.clientY / threeContainer.clientHeight) * 2 + 1;
  }

  function handleSphereOnHover(time) {
    let intersects = [];

    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(onHoverRaycastObjects);

    if (intersects.length) {
      if (intersected !== intersects[0].object) {
        intersected = intersects[0].object;

        tween = new TWEEN.Tween(intersected.material.color)
          .to({ r: 1, g: -2, b: -2 }, 300)
          .easing(TWEEN.Easing.Cubic.In)
          .start();
      }
    } else {
      if (intersected) {
        if (tween) {
          tween.stop();
        }

        tween = new TWEEN.Tween(intersected.material.color)
          .to({ r: 1, g: 1, b: 1 }, 200)
          .easing(TWEEN.Easing.Cubic.Out)
          .start();
      }

      intersected = null;
    }
  }

  const showSelectedTextElement = selectedSphereName => {
    if (selectedSphereName === SPHERE_LEFT_NAME) {
      visiblePanel = "about";
    } else if (selectedSphereName === SPHERE_CENTRE_NAME) {
      visiblePanel = "web";
    } else if (selectedSphereName === SPHERE_RIGHT_NAME) {
      visiblePanel = "more";
    }
  };

  const hideAllTextElements = () => {
    visiblePanel = null;
  };

  function resetSpherePositionTween(initialVector, resetVector, time = 1800) {
    resetPositionTween = new TWEEN.Tween(initialVector)
      .to(
        {
          x: resetVector.x,
          y: resetVector.y,
          z: resetVector.z
        },
        time
      )
      .easing(TWEEN.Easing.Elastic.Out)
      .start();
  }

  function resetSphere(sphereObject) {
    hideAllTextElements();
    hideHeader = false;
    sphereObject.material.color.setHex(0xffffff);
    onHoverRaycastObjects = [...DEFAULT_ON_HOVER_RAYCAST_OBJECTS];

    if (hideIconTween) {
      hideIconTween.stop();
    }

    sphereObject.parent.children[2].material.opacity = ICON_BASE_OPACITY;

    if (geometryChangeTween) {
      geometryChangeTween.stop();
    }

    sphereObject.geometry.dispose();
    sphereObject.geometry = sphereGeometry.clone();
    sphereObject.scale.set(1, 1, 1);

    resetSpherePositionTween(
      sphereObject.parent.position,
      sphereObject.parent.originalPosition
    );
  }

  function handleMouseClick(event) {
    updateMouseCoords(event);

    let intersects = [];

    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects([
      ...DEFAULT_ON_HOVER_RAYCAST_OBJECTS
    ]);

    if (intersects.length) {
      if (selectedSphere && selectedSphere === intersects[0].object) {
        resetSphere(selectedSphere);
        selectedSphere = null;
      } else {
        if (selectedSphere) {
          resetSphere(selectedSphere);
        }

        selectedSphere = intersects[0].object;

        new TWEEN.Tween(selectedSphere.parent.position)
          .to(
            {
              x: -selectedSphere.position.x / 1.5,
              y: -0.05,
              z: 0.95 - selectedSphere.position.z
            },
            1300
          )
          .onStart(() => {
            onHoverRaycastObjects = onHoverRaycastObjects.filter(
              object => object.name !== selectedSphere.name
            );
            hideIconTween = new TWEEN.Tween(
              selectedSphere.parent.children[2].material
            )
              .to({ opacity: 0 }, 750)
              .easing(TWEEN.Easing.Cubic.In)
              .start();
            selectedSphere.material.color.setRGB({ r: 1, g: -2, b: -2 });
          })
          .easing(TWEEN.Easing.Quartic.Out)
          .onComplete(() => {
            if (selectedSphere) {
              selectedSphere.geometry.dispose();
              selectedSphere.geometry = new THREE.PlaneGeometry(
                0.21,
                0.21,
                Z_ORIG_POSITION
              );

              geometryChangeTween = new TWEEN.Tween(selectedSphere.scale)
                .to({ y: window.innerHeight }, 600)
                .onStart(() => {
                  hideHeader = true;
                })
                .easing(TWEEN.Easing.Quartic.In)
                .onComplete(() => {
                  showSelectedTextElement(selectedSphere.name);
                })
                .start();
            }
          })
          .start();
      }
    } else if (selectedSphere) {
      resetSphere(selectedSphere);
      selectedSphere = null;
    }
  }

  function sphereBobbing(time) {
    const yOffOne = -Math.abs(Math.sin(time * 2 - 0.06));
    const yOffTwo = Math.abs(Math.sin(time * 2 - 0.004));
    const yOffThree = Math.abs(Math.sin(time * 2 + 0.007)) * 0.9;

    sphereCentre.position.y =
      0.5 + THREE.MathUtils.lerp(-0.009, 0.012, yOffOne);
    webImagePlane.position.y =
      0.49 + THREE.MathUtils.lerp(-0.009, 0.012, yOffOne);

    sphereRight.position.y = 0.5 + THREE.MathUtils.lerp(-0.01, 0.009, yOffTwo);
    moreImagePlane.position.y =
      0.48 + THREE.MathUtils.lerp(-0.01, 0.009, yOffTwo);

    sphereLeft.position.y = 0.48 + THREE.MathUtils.lerp(-0.01, 0.01, yOffThree);
    aboutImagePlane.position.y =
      0.475 + THREE.MathUtils.lerp(-0.01, 0.01, yOffThree);
  }

  // ** init ** //
  function init() {
    threeContainer = document.getElementById("three");

    window.addEventListener("mousemove", updateMouseCoords, false);
    window.addEventListener("click", handleMouseClick, true);
    window.addEventListener("resize", resizeCanvasToDisplaySize, false);

    const initialDimensions = getAspectSize(
      threeContainer.clientWidth,
      threeContainer.clientHeight,
      TARGET_ASPECT_RATIO
    );

    camera = new THREE.PerspectiveCamera(
      70,
      initialDimensions.width / initialDimensions.height,
      0.01,
      10
    );
    camera.position.set(0, 0.4, 1.3);

    raycaster = new THREE.Raycaster();

    // textures
    const loader = new THREE.TextureLoader();
    const shadowTexture = loader.load(shadowImage);

    aboutTexture = loader.load(aboutImage);
    webTexture = loader.load(webImage);
    moreTexture = loader.load(moreImage);

    // scene
    scene = new THREE.Scene();

    // light
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(0, 50, 30);
    scene.add(light);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.3);
    light2.position.set(0, 5, 60);
    scene.add(light2);

    // spheres
    sphereGeometry = new THREE.SphereGeometry(
      SPHERE_RADIUS,
      SPHERE_SEGMENTS,
      SPHERE_SEGMENTS
    );
    const sphereMaterial = new THREE.MeshStandardMaterial();

    const shadowGeometry = new THREE.PlaneBufferGeometry(1, 1);
    const shadowMaterial = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false
    });

    //create and populate bases
    // left
    baseLeft = new THREE.Object3D();
    baseLeft.originalPosition = baseLeft.position.clone();
    scene.add(baseLeft);

    const shadowMeshLeft = new THREE.Mesh(
      shadowGeometry,
      shadowMaterial.clone()
    );
    shadowMeshLeft.position.set(-0.63, 0.001, -0.1);
    shadowMeshLeft.rotation.x = Math.PI * -0.5;
    shadowMeshLeft.rotation.y = 0.06;
    shadowMeshLeft.scale.set(0.3, 0.3, 0.3);

    sphereLeft = new THREE.Mesh(sphereGeometry, sphereMaterial.clone());
    sphereLeft.position.set(
      SPHERE_X_OFFSET * -1,
      Y_ORIG_POSITION,
      Z_ORIG_POSITION
    );
    sphereLeft.name = SPHERE_LEFT_NAME;

    baseLeft.add(shadowMeshLeft);
    baseLeft.add(sphereLeft);

    // centre
    baseCentre = new THREE.Object3D();
    baseCentre.originalPosition = baseCentre.position.clone();
    scene.add(baseCentre);

    const shadowMeshCentre = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadowMeshCentre.position.set(0, 0.001, -0.1);
    shadowMeshCentre.rotation.x = Math.PI * -0.5;
    shadowMeshCentre.scale.set(0.3, 0.3, 0.3);

    sphereCentre = new THREE.Mesh(sphereGeometry, sphereMaterial.clone());
    sphereCentre.position.set(0, Y_ORIG_POSITION, Z_ORIG_POSITION);
    sphereCentre.name = SPHERE_CENTRE_NAME;

    baseCentre.add(sphereCentre);
    baseCentre.add(shadowMeshCentre);

    // right
    baseRight = new THREE.Object3D();
    baseRight.originalPosition = baseRight.position.clone();
    scene.add(baseRight);

    const shadowMeshRight = shadowMeshCentre.clone();
    shadowMeshRight.position.set(0.63, 0.001, -0.1);
    shadowMeshRight.rotation.x = Math.PI * -0.5;
    shadowMeshRight.rotation.y = -0.06;
    shadowMeshRight.scale.set(0.3, 0.3, 0.3);

    sphereRight = new THREE.Mesh(sphereGeometry, sphereMaterial.clone());
    sphereRight.position.set(SPHERE_X_OFFSET, Y_ORIG_POSITION, Z_ORIG_POSITION);
    sphereRight.name = SPHERE_RIGHT_NAME;

    baseRight.add(shadowMeshRight);
    baseRight.add(sphereRight);

    // icon planes
    iconGeometry = new THREE.PlaneGeometry(0.1, 0.1, 10, 10);

    // left (about)
    aboutImagePlane = new THREE.Mesh(
      iconGeometry,
      new THREE.MeshBasicMaterial({
        map: aboutTexture,
        transparent: true,
        opacity: ICON_BASE_OPACITY
      })
    );

    aboutImagePlane.position.set(-0.558, 0.5, 0.1);
    aboutImagePlane.name = "aboutImagePlane";
    baseLeft.add(aboutImagePlane);

    // centre (web work)
    webImagePlane = new THREE.Mesh(
      iconGeometry,
      new THREE.MeshBasicMaterial({
        map: webTexture,
        transparent: true,
        opacity: ICON_BASE_OPACITY
      })
    );

    webImagePlane.position.set(0, 0.5, 0.1);
    webImagePlane.name = "webImagePlane";
    baseCentre.add(webImagePlane);

    // right (more info)
    moreImagePlane = new THREE.Mesh(
      iconGeometry,
      new THREE.MeshBasicMaterial({
        map: moreTexture,
        transparent: true,
        opacity: ICON_BASE_OPACITY
      })
    );

    moreImagePlane.position.set(0.565, 0.5, 0.1);
    moreImagePlane.name = "moreImagePlane";
    baseRight.add(moreImagePlane);

    // set hoverable objects
    DEFAULT_ON_HOVER_RAYCAST_OBJECTS = [sphereLeft, sphereCentre, sphereRight];
    onHoverRaycastObjects = [...DEFAULT_ON_HOVER_RAYCAST_OBJECTS];

    // renderer
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xffffff, 0);
    renderer.setSize(initialDimensions.width, initialDimensions.height);
    threeContainer.appendChild(renderer.domElement);

    resizeCanvasToDisplaySize();
  }

  function update(time) {
    handleSphereOnHover(time);
    sphereBobbing(time);
  }

  function render() {
    renderer.render(scene, camera);
  }

  function animate(time) {
    time *= 0.0004;
    requestAnimationFrame(animate);
    TWEEN.update();
    update(time);
    render();
  }
</script>

<style>
  :global(canvas) {
    position: absolute;
    margin: auto;
  }

  :global(a) {
    color: burlywood;
  }

  .three-container {
    display: flex;
    position: relative;
    align-items: center;
    width: 80%;
    height: 100vh;
    margin: auto;
  }

  .overlay {
    display: flex;
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100vh;
  }

  .title-container {
    font-family: "Jaldi", Helvetica, sans-serif;
    position: absolute;
    display: flex;
    flex-direction: column;
    left: 28%;
    top: 20vh;
    line-height: 550%;
  }

  .header {
    font-size: 5vw;
  }

  .sub-header {
    font-size: 2.5vw;
    opacity: 0.6;
    margin-left: 0.5vw;
  }

  .text-container {
    position: absolute;
    top: calc(50vh - 20vw);
    width: 18vw;
    height: 20vw;
    font-family: "Jaldi", Helvetica, sans-serif;
    font-size: 1.5vw;
    color: #ffffee;
  }

  .about-text-container {
    left: 15.76%;
  }

  .work-text-container {
    left: 38.75%;
  }

  .other-text-container {
    right: 15.76%;
  }

  .divider {
    width: 5vw;
    border: 1px solid #ffffee;
    margin: 15% auto;
  }
</style>

<svelte:head>
  <link href="https://fonts.googleapis.com/css?family=Jaldi" rel="stylesheet" />
</svelte:head>
<div class="three-container" id="three">
  {#if !hideHeader}
    <div transition:fade={{ duration: 100 }} class="title-container">
      <span class="header">PAUL MILLEN</span>
      <span class="sub-header">front-end developer</span>
    </div>
  {/if}
  <div class="overlay">
    {#if visiblePanel === 'about'}
      <div class="text-container about-text-container">
        <p>
          <strong>Hello</strong>
        </p>
        <p>
          Front-end / JS developer with the usual tech - React, Vue (and
          Svelte).
        </p>
        <p>
          Also enjoy the occasional bit of back-end. Always keen to learn more.
        </p>
        <p>Based in London.</p>
      </div>
    {/if}
    {#if visiblePanel === 'web'}
      <div class="text-container work-text-container">
        <p>
          <strong>Stuff I'm working on...</strong>
        </p>
        <p style="font-size: 1.2vw;">
          This is something I built to help me learn French:
        </p>
        <Link to="verb-whale">Verb Whale</Link>
        <p style="font-size: 1.2vw; margin-top: 20vw">
          Other things will go here when they're finished...
        </p>
      </div>
    {/if}
    {#if visiblePanel === 'more'}
      <div class="text-container other-text-container">
        <span>
          <p>
            <strong>What else...</strong>
          </p>
          <p style="font-size: 1.2vw;">
            Once a theatre sound designer and production sound recordist for
            film and TV.
          </p>
          <p style="font-size: 1.2vw;">
            Github based
            <a href="https://github.com/paulmillen/cv-small">CV</a>
            for more.
          </p>
          <div class="divider" />
          <p style="font-size: 1.2vw;">
            I enjoy distance running and film and digital photography.
          </p>
          <p style="font-size: 1.2vw;">
            May I bore you with some
            <a href="https://www.flickr.com/photos/nmtm">photos</a>
            ?
          </p>
        </span>
      </div>
    {/if}
  </div>
</div>
