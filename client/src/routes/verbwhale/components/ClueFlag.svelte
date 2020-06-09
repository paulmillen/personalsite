<script>
  import { createEventDispatcher } from "svelte";
  import flagImage from "assets/france-flag-icon.png";
  import Popup from "./Popup.svelte";

  export let frenchTranslation = "";
  let isPopupVisible = false;
  let positionX = 0;
  let positionY = 0;

  const showPopup = event => {
    isPopupVisible = true;
    positionX = event.clientX;
    positionY = event.clientY;
  };

  const hidePopup = () => {
    isPopupVisible = false;
    positionX = null;
    positionY = null;
  };
</script>

<style>
  .flag-container {
    position: relative;
    cursor: pointer;
    font-weight: 600;
    color: #000;
  }

  .flag-img {
    width: 100%;
  }

  .clue-text {
    position: absolute;
    top: 47%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>

<div>
  <div on:click={showPopup} on:mouseleave={hidePopup} class="flag-container">
    <img class="flag-img" alt="french flag" src={flagImage} />
    <span class="clue-text">?</span>
  </div>
  {#if positionX && positionY && showPopup}
    <Popup {positionX} {positionY} text={frenchTranslation} />
  {/if}
</div>
