<script>
  import { fade } from "svelte/transition";
  export let isAnswerCorrect;
</script>

<style>
  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-text {
    position: relative;
    color: #fff;
    text-align: center;
    flex: 2;
    background: #0f4c81;
    border-radius: 15px;
    padding: 5%;
    margin-right: 5%;
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
    height: auto;
    width: 50%;
    flex: 3;
  }
</style>

<div class="header-container">
  <h1 class="header-text">
    {#if isAnswerCorrect !== null}
      {#if isAnswerCorrect}
        <span in:fade={{ duration: 600 }} style="color:#ffEA00">Correct!</span>
      {:else}
        <span in:fade={{ duration: 600 }}>Non!</span>
      {/if}
    {:else}
      <span in:fade={{ duration: 300 }}>Traduis!</span>
    {/if}
  </h1>
  <img alt="whale" src="/assets/whale.png" class="whale-img" />
</div>
