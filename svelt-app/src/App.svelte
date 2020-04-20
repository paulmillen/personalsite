<script>
	import { Router, Route } from "svelte-routing";	
	import { Link } from "svelte-routing";
	import Home from './routes/Home.svelte'
	import Conjugator from './routes/Conjugator.svelte'
</script>

<Router>
  <nav>
    <Link to='/'>Home</Link>
    <Link to='conjugator'>Conjugator</Link>
  </nav>
  <div>
    <Route path="/conjugator" component={Conjugator} />
    <Route path="/" component={Home} />
  </div>
</Router>

<style>
</style>