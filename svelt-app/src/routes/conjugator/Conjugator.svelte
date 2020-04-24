<script>
  import { onMount } from "svelte";
  import { getRandomItemFromArray } from "./utils.js";
  import { verbTable, availableTenses } from "./data.js";

  let translationData = {};
  let value;
  let isAnswerCorrect = null;

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
  };

  const setIsAnswerCorrect = () => {
    if (value) {
      isAnswerCorrect = value === translationData.fr;
    }
  };
</script>

<style>
  h1 {
    margin: 0;
  }

  form {
    margin: 20px 0 20px 0;
    text-align: center;
  }

  input {
    height: 50px;
    width: 200px;
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
    max-width: 1020px;
    flex-direction: column;
    background-color: #419ae9;
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
    <h1>Translate!</h1>
    <p>{`tense: ${translationData.tense}`}</p>
    <h1>{translationData.en}</h1>
    <form>
      <input bind:value />
      <button class="check-button" on:click|preventDefault={setIsAnswerCorrect}>
        check
      </button>
    </form>
    {#if isAnswerCorrect !== null && isAnswerCorrect}
      <span>Correct!</span>
    {:else if isAnswerCorrect !== null}
      <span>Wrong</span>
    {/if}
    <br />
    <button class="next-button" on:click={getNextQuestion}>Another!</button>
  </div>
</div>
