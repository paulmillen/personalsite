<script>
  import { onMount } from "svelte";
  import { getTranslationData } from "./dataHelpers.js";
  import {
    verbTable,
    availableTenses,
    fetchAndStoreVerbData
  } from "./store.js";
  import Popup from "./components/Popup.svelte";
  import Whale from "./components/Whale.svelte";
  import SettingsModal from "./components/SettingsModal.svelte";

  let translationData = {};
  let value = "";
  let isAnswerCorrect = null;
  let isPopupVisible = false;
  let positionX = 0;
  let positionY = 0;
  let apiDataPromise;
  let showSettingsModal = false;

  onMount(() => {
    apiDataPromise = fetchAndStoreVerbData().then(
      () => (translationData = getTranslationData($availableTenses, $verbTable))
    );
  });

  const getNextTranslation = () => {
    translationData = getTranslationData($availableTenses, $verbTable);
    isAnswerCorrect = null;
    value = "";
  };

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

  const handleModalButtonClick = () => {
    showSettingsModal = !showSettingsModal;
  };
</script>

<style>
  h1 {
    margin: 0;
    font-size: 40px;
  }

  p {
    font-size: 20px;
    margin: 10px 0 10px 0;
  }

  form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 15px 0 10px 0;
    text-align: center;
  }

  input {
    height: 50px;
    font-size: 20px;
    width: 100%;
    margin-right: 20px;
    text-indent: 10px;
  }

  button {
    border: 2px solid #fff;
    border-radius: 5px;
    font-size: 20px;
    color: #fff;
    background-color: transparent;
  }

  button:hover {
    background-color: #0f4c81;
  }

  button:disabled {
    color: grey;
  }

  .modal-button {
    border: none;
    font-size: 35px;
    max-width: min-content;
    margin-bottom: 40px;
  }

  .modal-button:hover {
    background-color: transparent;
    cursor: pointer;
  }

  .container {
    font-family: "Quicksand";
    color: #fff;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: #419ae9;
  }

  .inner-container {
    display: flex;
    flex-direction: column;
    margin: auto;
    min-width: 440px;
    max-width: 440px;
    background-color: #419ae9;
  }

  .translation-text-container {
    display: flex;
  }

  .flag-img {
    cursor: pointer;
    margin: 8px;
    height: 20px;
    width: auto;
  }

  .check-button {
    width: 100px;
    height: 50px;
  }

  .next-button {
    height: 50px;
    margin-top: 20px;
  }
</style>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css?family=Quicksand"
    rel="stylesheet" />
</svelte:head>
<div class="container">
  <div class="inner-container">
    {#await apiDataPromise}
      <p>loading...</p>
    {:then response}
      <button class="modal-button" on:click={handleModalButtonClick}>
        &#9881;
      </button>
      <Whale {isAnswerCorrect} />
      <p>{`tense: ${translationData.tense}`}</p>
      <div class="translation-text-container">
        <h1>{translationData.en}</h1>
        <img
          on:click={showPopup}
          on:mouseleave={hidePopup}
          class="flag-img"
          alt="french flag"
          src="assets/france-flag-icon.png" />
      </div>
      <form>
        <input
          on:keydown={() => (isAnswerCorrect = null)}
          bind:value
          placeholder="translation" />
        <button
          class="check-button"
          disabled={value === ''}
          on:click|preventDefault={() => (isAnswerCorrect = value === translationData.fr)}>
          check
        </button>
      </form>
      <button class="next-button" on:click={getNextTranslation}>
        Another!
      </button>
      <SettingsModal
        on:closeModal={handleModalButtonClick}
        showModal={showSettingsModal}
        onConfirm={getNextTranslation} />
    {:catch error}
      <h1>Oh no!</h1>
      <p>{error.message}</p>
    {/await}
  </div>
  {#if positionX && positionY && showPopup}
    <Popup {positionX} {positionY} text={translationData.fr} />
  {/if}
</div>
