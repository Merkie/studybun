<script lang="ts">
	import type { IUser, ISet } from '$lib/types';
	import SetDisplayCard from '../components/SetDisplayCard.svelte';
	export let data: { user: IUser; url: string; sets: ISet[] };
</script>

<h1>All study sets</h1>
<span style="display: flex; flex-wrap: wrap; gap: 30px;">
	{#each data.sets as item}
		<SetDisplayCard set={item} />
	{/each}
</span>
