<script>
	import { Lucia } from 'lucia-sveltekit/client';
	import { theme } from '$lib/stores';
	import Header from '../components/Header.svelte';

	export let data;

	let lightTheme = `
		--surface-background: white;
		--background: #f3c2d4;
		--container-background: #d7f1f6;
		--border: #3f808d;
		--text-color: black;
	`.trim();

	let darkTheme = `
		--surface-background: #0e1324;
		--background: #080b16;
		--container-background: #161e3c;
		--border: #4f609d;
		--text-color: white;
	`.trim();

	let utdTheme = `
		--surface-background: white;
		--background: #2ecc71;
		--container-background: #ffb270;
		--border: #30336b;
		--text-color: #130f40;
	`.trim();

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

<Lucia>
	<span
		style={`${$theme == 'light' ? lightTheme : ''} ${$theme == 'dark' ? darkTheme : ''} ${
			$theme == 'utd' ? utdTheme : ''
		}`}
	>
		<main>
			<slot />
		</main>
		<Header discordLoginUrl={data.url} user={data.user} />
	</span>
</Lucia>

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
		background-color: var(--surface-background);
		padding: 30px;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		position: relative;
	}
</style>
