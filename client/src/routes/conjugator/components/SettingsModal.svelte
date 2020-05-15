<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { flip } from "svelte/animate";
  import { quintOut } from "svelte/easing";
  import { crossfade, fade } from "svelte/transition";
  import {
    availableVerbs,
    verbTable,
    fetchAndStoreVerbData
  } from "../store.js";

  export let showModal = false;
  export let onConfirm = () => null;
  let currentVerbs = Object.keys($verbTable);
  let unselectedVerbs = $availableVerbs.filter(
    verb => !currentVerbs.includes(verb)
  );

  const dispatch = createEventDispatcher();
  const closeModal = () => {
    dispatch("closeModal");
  };

  const handleClose = () => {
    dispatch("closeModal");
    currentVerbs = Object.keys($verbTable);
    unselectedVerbs = $availableVerbs.filter(
      verb => !currentVerbs.includes(verb)
    );
  };

  const select = verb => {
    currentVerbs = [...currentVerbs, verb];
    unselectedVerbs = unselectedVerbs.filter(
      unselectedVerb => unselectedVerb !== verb
    );
  };

  const deSelect = verb => {
    unselectedVerbs = [...unselectedVerbs, verb];
    currentVerbs = currentVerbs.filter(currentVerb => currentVerb !== verb);
  };

  const confirm = () => {
    fetchAndStoreVerbData(currentVerbs);
    onConfirm();
    closeModal();
  };

  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 1500)
  });
</script>

<style>
  .modal-container {
    display: flex;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: #0006;
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #419ae9;
    border: 4px solid #fff;
    border-radius: 5px;
    max-width: 440px;
    width: 100%;
    margin: auto;
    padding: 5px;
  }

  .title-container {
    display: flex;
    margin-bottom: 5px;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .title {
    margin: auto;
    font-size: 30px;
    padding-left: 28px;
  }

  .close-button {
    display: inline-flex;
    font-size: 20px;
    cursor: pointer;
    background-color: #419ae9;
    border: none;
    text-align: center;
    height: 30px;
  }

  .verb-lists-container {
    display: flex;
  }

  .verb-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 200px;
    min-height: 200px;
  }

  .selected-verbs {
    background-color: red;
    border: 2px solid #fff;
    border-radius: 5px;
    padding: 3px;
  }

  .selected-text {
    font-weight: 600;
  }
  .verb-button {
    font-size: 20px;
    cursor: pointer;
    color: #fff;
    background: none;
    border: none;
  }

  .confirm-button {
    border: 2px solid #fff;
    border-radius: 5px;
    font-size: 20px;
    padding: 5px 10px;
    margin: 20px 0 5px 0;
    color: #fff;
    background-color: transparent;
  }

  .confirm-button:hover {
    background-color: #0f4c81;
  }

  .confirm-button:disabled {
    color: grey;
  }
</style>

{#if showModal}
  <div transition:fade={{ duration: 250 }} class="modal-container">
    <div class="modal-content">
      <div class="title-container">
        <span class="title">
          <strong>Verb Selector</strong>
        </span>
        <button class="close-button" on:click={handleClose}>&#10060;</button>
      </div>
      <div class="verb-lists-container">
        <div class="verb-list selected-verbs">
          {#each currentVerbs as verb (verb)}
            <button
              class="verb-button"
              on:click={deSelect(verb)}
              in:receive={{ key: verb }}
              out:send={{ key: verb }}
              animate:flip={{ duration: 200 }}>
              {verb}
            </button>
          {/each}
          <span>----</span>
          <span class="selected-text">
            {currentVerbs.length ? 'selected' : 'non selected!'}
          </span>
        </div>
        <div class="verb-list">
          {#each unselectedVerbs as verb (verb)}
            <button
              class="verb-button"
              on:click={select(verb)}
              in:receive={{ key: verb }}
              out:send={{ key: verb }}
              animate:flip={{ duration: 200 }}>
              {verb}
            </button>
          {/each}
        </div>
      </div>
      <button
        on:click={confirm}
        disabled={!currentVerbs.length}
        class="confirm-button">
        Confirm!
      </button>
    </div>
  </div>
{/if}
