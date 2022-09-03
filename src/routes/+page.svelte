<script lang="ts">
	import type { IUser, ISet } from '$lib/types';
	import Header from '../components/Header.svelte';
	import SetDisplayCard from '../components/SetDisplayCard.svelte';
	export let data: { user: IUser; url: string; sets: ISet[] };
</script>

<main>
	<h1>All study sets</h1>
	<span style="display: flex; flex-wrap: wrap; gap: 30px;">
		{#each data.sets as item}
			<SetDisplayCard set={item} />
		{/each}
	</span>
</main>

<Header discordLoginUrl={data.url} user={data.user} />

<style>
	main {
		width: min(75%, 1200px);
		margin: 0 auto;
		margin-top: 100px;
		margin-bottom: 30px;
		background-color: var(--surface-background);
		padding: 30px;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
