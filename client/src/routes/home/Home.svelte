<script>
  import HomeDesktop from "./HomeDesktop.svelte";
  const isMobile = window.navigator.userAgent.includes("Mobi");
</script>

{#if isMobile}
  <div>MOBILE VIEW</div>
{:else}
  <HomeDesktop />
{/if}
