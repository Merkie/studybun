<script lang="ts">
	import type { IUser } from '$lib/types';
	import Header from '../components/Header.svelte';
	export let data: { user: IUser; url: string };
</script>

<svelte:head>
	<title>Home | Study Bun</title>
</svelte:head>

<Header discordLoginUrl={data.url} user={data.user} />
<h1>Hello!</h1>
