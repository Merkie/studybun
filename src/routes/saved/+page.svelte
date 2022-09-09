<script lang="ts">
	import type { ISet, IUser } from '$lib/types';
	import SetDisplayCard from '$lib/components/SetDisplayCard.svelte';

	export let data: { user: IUser; sets: ISet[] };
</script>

{#if data.user}
	<h1>Your saved sets</h1>
	<span style="display: flex; flex-wrap: wrap; gap: 30px;">
		{#each data.sets as item}
			<SetDisplayCard set={item} index={data.sets.indexOf(item)} />
		{/each}
	</span>
{/if}
