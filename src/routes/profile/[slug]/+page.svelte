<script>
	import Header from '../../../components/Header.svelte';
	export let data;
</script>

<Header discordLoginUrl={data.url} user={data.user} />
<p>{JSON.stringify(data.slugUser)}</p>
