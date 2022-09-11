<script lang="ts">
	import type { IUser, ISet } from '$lib/types';
	import SetDisplayCard from '$lib/components/SetDisplayCard.svelte';
	import { Eye, Fire, Icon } from 'svelte-hero-icons';
	export let data: {
		user: IUser;
		url: string;
		sets: ISet[];
		trendingSets: ISet[];
		recentlyViewed: ISet[];
		savedSets: string[];
	};
</script>

{#if data.recentlyViewed.length > 0}
	<h1><Icon width={'35px'} solid={true} src={Eye} />Recently Viewed</h1>
	<span class="card-container">
		{#each data.recentlyViewed as item}
			<SetDisplayCard saved={data.savedSets} index={data.recentlyViewed.indexOf(item)} {...item} />
		{/each}
	</span>
{/if}

{#if data.trendingSets.length > 1}
	<h1><Icon width={'35px'} solid={true} src={Fire} />Trending Sets</h1>
	<span class="card-container">
		{#each data.trendingSets as item}
			<SetDisplayCard saved={data.savedSets} index={data.trendingSets.indexOf(item)} {...item} />
		{/each}
	</span>
{/if}

<style>
	h1 {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.card-container {
		display: flex;
		flex-wrap: wrap;
		gap: 30px;
		padding-bottom: 30px;
		border-bottom: 1px solid var(--border);
	}
</style>
