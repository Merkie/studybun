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
	};
</script>

{#if data.recentlyViewed}
	<h1><Icon width={'35px'} solid={true} src={Eye} />Recently Viewed</h1>
	<span class="card-container">
		{#each data.recentlyViewed as item}
			<SetDisplayCard index={data.recentlyViewed.indexOf(item)} set={item} />
		{/each}
	</span>
{/if}

<h1><Icon width={'35px'} solid={true} src={Fire} />Trending Sets</h1>

<span class="card-container">
	{#each data.trendingSets as item}
		<SetDisplayCard index={data.trendingSets.indexOf(item)} set={item} />
	{/each}
</span>

<h1>All study sets</h1>
<span class="card-container">
	{#each data.sets as item}
		<SetDisplayCard index={data.sets.indexOf(item)} set={item} />
	{/each}
</span>

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
