<script>
  import { fade } from "svelte/transition";
  export let positionX;
  export let positionY;
  export let text;
</script>

<style>
  div {
    position: absolute;
    top: var(--top);
    left: var(--left);
    z-index: 9999;
    border: 3px solid white;
    border-radius: 5px;
    background-color: #0f4c81;
    font-size: 20px;
    padding: 10px;
  }
</style>

<div
  transition:fade
  style="--top:{`${positionY}px`}; --left:{`${positionX + 30}px`}">
  {text}
</div>
