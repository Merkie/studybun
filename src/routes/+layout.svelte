<script>
	import { signOut } from 'lucia-sveltekit/client';
	import { Lucia } from 'lucia-sveltekit/client';
</script>

<Lucia>
	<main>
		<slot />
	</main>
</Lucia>

<style>
	:global(body) {
		--light-pink: #ffe4ee;
		margin: 0;
		background-color: var(--light-pink);
		font-family: sans-serif;
	}
</style>
