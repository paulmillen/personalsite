<script>
  import { onMount } from "svelte";
  import { getRandomItemFromArray } from "./utils.js";
  import { verbTable, availableTenses } from "./data.js";

  let translationData = {};

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
      conjugation: { [randomEntry[0]]: randomEntry[1] }
    };
  };

  const setTranslationData = () => {
    const tense = getRandomTense();
    const verb = getRandomVerb();
    const tenseBlock = getTenseBlock(tense, verb);
    translationData = getTranslationData(tenseBlock);
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
  verb
  <h1>Conjugator</h1>
  <span>Translate!</span>
  <button on:click={setTranslationData} />
  <p>{JSON.stringify(translationData)}</p>
</div>
