<script>
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
</style>

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
