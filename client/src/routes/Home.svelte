<script>
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";
  import * as THREE from "three";
  import TWEEN from "@tweenjs/tween.js";

  onMount(() => {
    init();
    animate();
    mouse.x = -10;
    mouse.y = -10;
  });

  const mouse = new THREE.Vector2();
  let renderer,
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
    geometryChangeTween,
    DEFAULT_ON_HOVER_RAYCAST_OBJECTS,
    onHoverRaycastObjects;

  function init() {
    window.addEventListener("mousemove", updateMouseCoords, false);
    window.addEventListener("click", handleMouseClick, true);

    camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      10
    );
    camera.position.set(0, 0.4, 1.3);

    raycaster = new THREE.Raycaster();

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

    DEFAULT_ON_HOVER_RAYCAST_OBJECTS = [sphereLeft, sphereCentre, sphereRight];
    onHoverRaycastObjects = [...DEFAULT_ON_HOVER_RAYCAST_OBJECTS];

    renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const threeContainer = document.getElementById("three");
    threeContainer.appendChild(renderer.domElement);
  }

  function updateMouseCoords(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
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
    sphereObject.material.color.setHex(0xffffff);
    onHoverRaycastObjects = [...DEFAULT_ON_HOVER_RAYCAST_OBJECTS];
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
              z: 1
            },
            1500
          )
          .onStart(() => {
            onHoverRaycastObjects = onHoverRaycastObjects.filter(
              object => object.name !== selectedSphere.name
            );
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
    time *= 0.0004;
    const yOffOne = -Math.abs(Math.sin(time * 2 - 0.06));
    const yOffTwo = Math.abs(Math.sin(time * 2 - 0.004));
    const yOffThree = Math.abs(Math.sin(time * 2 + 0.007)) * 0.9;
    sphereCentre.position.y =
      0.5 + THREE.MathUtils.lerp(-0.009, 0.012, yOffOne);
    sphereRight.position.y = 0.5 + THREE.MathUtils.lerp(-0.01, 0.009, yOffTwo);
    sphereLeft.position.y = 0.48 + THREE.MathUtils.lerp(-0.01, 0.01, yOffThree);
  }

  function update(time) {
    handleSphereOnHover(time);
    sphereBobbing(time);
  }

  function render() {
    renderer.render(scene, camera);
  }

  function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update();
    update(time);
    render();
  }
</script>

<style>
  :global(canvas) {
    display: block;
  }

  .three-container {
    position: absolute;
  }
</style>

<div class="three-container" id="three" />
