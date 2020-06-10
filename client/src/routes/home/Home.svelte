<script>
  import HomeDesktop from "./HomeDesktop.svelte";
  import HomeMobile from "./HomeMobile.svelte";
  const isMobile = window.navigator.userAgent.includes("Mobi");
</script>

{#if isMobile}
  <HomeMobile />
{:else}
  <HomeDesktop />
{/if}
