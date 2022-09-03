<script>
	import { Lucia } from 'lucia-sveltekit/client';
	import { theme } from '$lib/stores';

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

	$: {
		let userTheme = $theme === 'light' ? lightTheme : darkTheme;
		try {
			document.getElementsByTagName('body')[0].style.backgroundColor = userTheme
				.split('--background:')[1]
				.split(';')[0]
				.trim();

			document.getElementsByTagName('body')[0].style.color = userTheme
				.split('--text-color:')[1]
				.split(';')[0]
				.trim();
		} catch (e) {
			console.log(e);
		}
	}
</script>

<Lucia>
	<main style={`${$theme == 'light' ? lightTheme : darkTheme}`}>
		<slot />
	</main>
</Lucia>

<style>
	:global(body) {
		margin: 0;
		font-family: sans-serif;
	}
</style>
