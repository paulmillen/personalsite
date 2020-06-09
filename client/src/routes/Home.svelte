<script>
  import { onMount } from "svelte";
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

  let aboutTextVisibility = false;
  let workTextVisibility = false;
  let otherTextVisibility = false;

  const mouse = new THREE.Vector2();
  const ICON_BASE_OPACITY = 0.7;
  const TARGET_ASPECT_RATIO = 16 / 9;

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

  function init() {
    threeContainer = document.getElementById("three");
    window.addEventListener("mousemove", updateMouseCoords, false);
    window.addEventListener("click", handleMouseClick, true);

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

    const loader = new THREE.TextureLoader();
    const shadowTexture = loader.load(shadowImage);

    aboutTexture = loader.load(aboutImage);
    webTexture = loader.load(webImage);
    moreTexture = loader.load(moreImage);

    scene = new THREE.Scene();
    scene.background = new THREE.Color("white");

    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(0, 50, 30);
    scene.add(light);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.3);
    light2.position.set(0, 5, 60);
    scene.add(light2);

    sphereGeometry = new THREE.SphereGeometry(0.1, 50, 50);
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

    sphereCentre = new THREE.Mesh(sphereGeometry, sphereMaterial.clone());
    sphereCentre.position.set(0, 0.5, 0);
    sphereCentre.name = "sphereCentre";
    baseCentre.add(sphereCentre);
    baseCentre.add(shadowMeshCentre);

    baseRight = new THREE.Object3D();
    scene.add(baseRight);

    const shadowMeshRight = shadowMeshCentre.clone();
    shadowMeshRight.position.set(0.63, 0.001, -0.1);
    shadowMeshRight.rotation.x = Math.PI * -0.5;
    shadowMeshRight.rotation.y = -0.06;
    shadowMeshRight.scale.set(0.3, 0.3, 0.3);

    sphereRight = new THREE.Mesh(sphereGeometry, sphereMaterial.clone());
    sphereRight.position.set(0.6, 0.5, 0);
    sphereRight.name = "sphereRight";
    baseRight.add(shadowMeshRight);
    baseRight.add(sphereRight);

    baseLeft = new THREE.Object3D();
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
    sphereLeft.position.set(-0.6, 0.5, 0);
    sphereLeft.name = "sphereLeft";

    baseLeft.add(shadowMeshLeft);
    baseLeft.add(sphereLeft);

    iconGeometry = new THREE.PlaneGeometry(0.1, 0.1, 10, 10);

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

    DEFAULT_ON_HOVER_RAYCAST_OBJECTS = [sphereLeft, sphereCentre, sphereRight];
    onHoverRaycastObjects = [...DEFAULT_ON_HOVER_RAYCAST_OBJECTS];

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(initialDimensions.width, initialDimensions.height);
    threeContainer.appendChild(renderer.domElement);

    window.addEventListener("resize", resizeCanvasToDisplaySize, false);
    resizeCanvasToDisplaySize();
  }

  function updateMouseCoords(event) {
    event.preventDefault();
    mouse.x = (event.clientX / threeContainer.clientWidth) * 2 - 1.25;
    mouse.y = -(event.clientY / threeContainer.clientHeight) * 2 + 1;
  }

  function handleSphereOnHover(time) {
    let intersects = [];
    const intersectedOrigColor = 0xffffff;

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
    if (selectedSphereName === "sphereLeft") {
      aboutTextVisibility = true;
    } else if (selectedSphereName === "sphereCentre") {
      workTextVisibility = true;
    } else if (selectedSphereName === "sphereRight") {
      otherTextVisibility = true;
    }
  };

  const hideAllTextElements = () => {
    aboutTextVisibility = false;
    workTextVisibility = false;
    otherTextVisibility = false;
  };

  function resetSpherePositionTween(initialVector, resetVector, time = 2500) {
    new TWEEN.Tween(initialVector)
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
      sphereObject.originalParentPosition
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
        selectedSphere.originalParentPosition = selectedSphere.parent.position.clone();

        new TWEEN.Tween(selectedSphere.parent.position)
          .to(
            {
              x: -selectedSphere.position.x / 1.5,
              y: -0.05,
              z: 0.95
            },
            1500
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
              selectedSphere.geometry = new THREE.PlaneGeometry(0.21, 0.21, 0);

              geometryChangeTween = new TWEEN.Tween(selectedSphere.scale)
                .to({ y: window.innerHeight }, 1000)
                .easing(TWEEN.Easing.Quartic.In)
                .onComplete(() => {
                  selectedSphere.material.color.setHex(0xffffff);
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

  .text-container {
    display: none;
    position: absolute;
    top: calc(50vh - 20vw);
    width: 18vw;
    height: 20vw;
    font-size: 1.5vw;
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

  .aboutTextVisibility {
    display: block;
  }

  .workTextVisibility {
    display: block;
  }

  .otherTextVisibility {
    display: block;
  }
</style>

<div class="three-container" id="three">
  <div class="overlay">
    <div class:aboutTextVisibility class="text-container about-text-container">
      <span>About</span>
    </div>
    <div class:workTextVisibility class="text-container work-text-container">
      <span>Work</span>
    </div>
    <div class:otherTextVisibility class="text-container other-text-container">
      <span>Other stuff</span>
    </div>
  </div>
</div>
