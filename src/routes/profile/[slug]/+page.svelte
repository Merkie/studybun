<script>
	import Header from '../../../components/Header.svelte';
	export let data;
</script>

<Header discordLoginUrl={data.url} user={data.user} />
<main>
	<p>{JSON.stringify(data.slugUser)}</p>
</main>

<style>
	main {
		margin: 0 auto;
		margin-top: 100px;
		margin-bottom: 30px;
	}
</style>
