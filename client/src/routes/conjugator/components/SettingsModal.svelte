<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { verbTable } from "../store.js";

  export let showModal = false;
  $: verbs = Object.keys($verbTable);

  const dispatch = createEventDispatcher();
  const closeModal = () => {
    dispatch("closeModal");
  };
</script>

<style>
  .modal-container {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
  }

  .showModal {
    display: flex;
    justify-content: center;
    align-content: center;
  }

  .close-button {
    display: inline-flex;
  }

  .modal-content {
    display: flex;
    border: 4px solid #ffffff;
    border-radius: 5px;
  }
</style>

<div class="modal-container" class:showModal>
  <div class="modal-content">
    <button class="close-button" on:click={closeModal}>&#10060;</button>
    <div>
      <ul>
        {#each verbs as verb}
          <li>{verb}</li>
        {/each}
      </ul>
    </div>
  </div>
</div>
