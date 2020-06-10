<script>
  import { Router, Route } from "svelte-routing";
  import { Link } from "svelte-routing";
  import Home from "./routes/home/Home.svelte";
  import VerbWhale from "./routes/verbwhale/VerbWhale.svelte";
</script>

<style>
  .route-container {
    width: 100%;
    height: 100%;
  }
</style>

<Router>
  <div class="route-container">
    <Route path="/verb-whale" component={VerbWhale} />
    <Route path="/" component={Home} />
  </div>
</Router>
