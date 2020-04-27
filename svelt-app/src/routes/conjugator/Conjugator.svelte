<script>
  import { onMount } from "svelte";
  import { getRandomItemFromArray } from "./utils.js";
  import { verbTable, availableTenses } from "./data.js";
  import Popup from "./components/Popup.svelte";

  let translationData = {};
  let value = "";
  let isAnswerCorrect = null;
  let isPopupVisible = false;
  let positionX;
  let positionY;

  onMount(() => {
    setTranslationData();
  });

  const getRandomTense = () => {
    return getRandomItemFromArray(availableTenses);
  };

  const getRandomVerb = () => {
    const verbs = Object.keys(verbTable);
    return getRandomItemFromArray(verbs);
  };

  const getTenseBlock = (desiredTense, verb) => {
    const verbBlock = verbTable[verb];
    return verbBlock.find(block => block.tense === desiredTense);
  };

  const getTranslationData = tenseBlock => {
    const conjugationBlock = tenseBlock.conjugations;
    const conjugations = Object.entries(conjugationBlock);
    const randomEntry = getRandomItemFromArray(conjugations);

    return {
      tense: tenseBlock.tense,
      en: randomEntry[0],
      fr: randomEntry[1]
    };
  };

  const setTranslationData = () => {
    const tense = getRandomTense();
    const verb = getRandomVerb();
    const tenseBlock = getTenseBlock(tense, verb);
    translationData = getTranslationData(tenseBlock);
  };

  const getNextQuestion = () => {
    setTranslationData();
    isAnswerCorrect = null;
    value = "";
    translationTextLang = "en";
  };

  const setIsAnswerCorrect = () => {
    if (value) {
      isAnswerCorrect = value === translationData.fr;
    }
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
    margin: 15px 0 10px 0;
    text-align: center;
  }

  input {
    height: 50px;
    font-size: 20px;
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
    margin: auto;
    max-width: 440px;
    min-width: 440px;
    flex-direction: column;
    background-color: #419ae9;
  }

  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-text {
    position: relative;
    color: #fff;
    text-align: center;
    min-width: 150px;
    background: #0f4c81;
    border-radius: 15px;
    padding: 20px;
  }

  .header-text:after {
    content: "";
    position: absolute;
    right: 0;
    top: 60%;
    width: 0;
    height: 0;
    border: 15px solid transparent;
    border-left-color: #0f4c81;
    border-right: 0;
    border-bottom: 0;
    margin-top: -2.5px;
    margin-right: -15px;
  }

  .whale-img {
    height: 150px;
    width: auto;
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
    <div class="header-container">
      <h1 class="header-text">
        {#if isAnswerCorrect !== null}
          {#if isAnswerCorrect}
            <span style="color:#ffEA00">Correct!</span>
          {:else}
            <span>Non!</span>
          {/if}
        {:else}
          <span>Traduis!</span>
        {/if}
      </h1>
      <img alt="whale" src="/assets/whale.png" class="whale-img" />
    </div>
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
      <input on:keydown={() => (isAnswerCorrect = null)} bind:value />
      <button class="check-button" on:click|preventDefault={setIsAnswerCorrect}>
        check
      </button>
    </form>
    <button class="next-button" on:click={getNextQuestion}>Another!</button>
  </div>
  {#if positionX && (positionY && showPopup)}
    <Popup {positionX} {positionY} text={translationData.fr} />
  {/if}
</div>
