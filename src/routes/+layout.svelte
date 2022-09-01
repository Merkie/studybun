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
		--surface-background: white;

		--light-pink: #ffe4ee;
		--border: #c4a2b6;
		--dark-pink: #4c1b44;
		margin: 0;
		background-color: var(--light-pink);
		font-family: sans-serif;
	}
</style>
