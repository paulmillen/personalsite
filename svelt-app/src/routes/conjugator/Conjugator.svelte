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

  .container {
    width: 100%;
    height: 100%;
    background-color: blue;
  }
</style>

<div class="container">
  <h1>Conjugator</h1>
  <span>Translate!</span>
  <p>{`tense: ${translationData.tense}`}</p>
  <h1>{translationData.en}</h1>
  <input bind:value />
  <button on:click={setIsAnswerCorrect}>submit!</button>
  {#if isAnswerCorrect !== null && isAnswerCorrect}
    <span>Correct!</span>
  {:else if isAnswerCorrect !== null}
    <span>Wrong</span>
  {/if}
  <br />
  <button on:click={getNextQuestion}>Another!</button>
</div>
