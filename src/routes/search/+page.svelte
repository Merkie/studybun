<script lang="ts">
	import type { ISet } from '$lib/types';
	import SetDisplayCard from '$lib/components/SetDisplayCard.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { search_sets } from '$lib/api';

	let sets: ISet[];

	const search = async (query: string) => {
		sets = (await search_sets(query)).sets;
	};

	onMount(() => {
		search($page.url.searchParams.get('term') || '');
	});

	// TODO: Can I move this logic into a load function so the user doesnt see a blank screen?
	// Issue is getting the slug into the load function.
</script>

<h1>Study sets that match the term "{$page.url.searchParams.get('term')}"</h1>
<span style="display: flex; flex-wrap: wrap; gap: 30px;">
	{#if sets}
		{#each sets as item}
			<SetDisplayCard set={item} />
		{/each}
	{/if}
</span>
