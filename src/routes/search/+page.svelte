<script lang="ts">
	import type { IUser, ISet } from '$lib/types';
	import SetDisplayCard from '$lib/components/SetDisplayCard.svelte';
	export let data: { user: IUser; url: string; sets: ISet[] };
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let sets: ISet[];

	const search = async (query: string) => {
		const response = await fetch(`/api/set/search`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ term: query })
		});
		sets = JSON.parse(await (await response.blob()).text()).sets;
	};

	onMount(() => {
		search($page.url.searchParams.get('term') || '');
	});
</script>

<h1>Study sets that match the term "{$page.url.searchParams.get('term')}"</h1>
<span style="display: flex; flex-wrap: wrap; gap: 30px;">
	{#if sets}
		{#each sets as item}
			<SetDisplayCard set={item} />
		{/each}
	{/if}
</span>
