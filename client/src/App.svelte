<script>
  import { Router, Route } from "svelte-routing";
  import { Link } from "svelte-routing";
  import Home from "./routes/Home.svelte";
  import Conjugator from "./routes/conjugator/Conjugator.svelte";
</script>

<style>
  .route-container {
    width: 100%;
    height: 100%;
  }
</style>

<Router>
  <div class="route-container">
    <Route path="/conjugator" component={Conjugator} />
    <Route path="/" component={Home} />
  </div>
</Router>
