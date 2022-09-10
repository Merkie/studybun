<script>
	import { Lucia } from 'lucia-sveltekit/client';
	import { theme } from '$lib/stores';
	import Header from '$lib/components/Header.svelte';
	import { darkTheme, lightTheme } from '$lib/themes';

	export let data;

	const utdTheme = {};

	$: {
		let userTheme = `${$theme == 'light' ? lightTheme : ''} ${$theme == 'dark' ? darkTheme : ''} ${
			$theme == 'utd' ? utdTheme : ''
		}`;
		try {
			document.getElementsByTagName('body')[0].style.backgroundColor = userTheme
				.split('--background:')[1]
				.split(';')[0]
				.trim();

			document.getElementsByTagName('body')[0].style.color = userTheme
				.split('--text-color:')[1]
				.split(';')[0]
				.trim();
		} catch (e) {}
	}
</script>

<span
	style={`${$theme == 'light' ? lightTheme : ''} ${$theme == 'dark' ? darkTheme : ''} ${
		$theme == 'utd' ? utdTheme : ''
	}`}
>
	<Lucia>
		<main>
			<slot />
		</main>
		<Header discordLoginUrl={data.url} user={data.user} />
	</Lucia>
</span>

<style>
	:global(body) {
		margin: 0;
		font-family: sans-serif;
	}

	:global(a) {
		color: var(--border);
	}

	main {
		width: min(calc(100% - 120px), 1200px);
		margin: 0 auto;
		margin-top: 100px;
		margin-bottom: 40px;
		background-color: var(--surface-background);
		padding: 30px;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		position: relative;
	}
</style>
