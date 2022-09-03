<script lang="ts">
	import Header from '../../../components/Header.svelte';
	import type { IUser } from '$lib/types';
	import SetDisplayCard from '../../../components/SetDisplayCard.svelte';
	export let data: { user: IUser; slugUser: IUser; url: string };
</script>

<Header discordLoginUrl={data.url} user={data.user} />
<main>
	<div class="header">
		<img src={data.slugUser.image} width="100px" alt="" />
		<h1>{data.slugUser.name} <small>User</small></h1>
	</div>

	<h1>{data.slugUser.name}'s study sets</h1>
	<span style="display: flex; flex-wrap: wrap; gap: 30px;">
		{#each data.slugUser.FlashcardSet as item}
			<!-- <p>{JSON.stringify(item)}</p> -->
			<SetDisplayCard set={item} />
		{/each}
	</span>
</main>

<style>
	main {
		width: min(75%, 1200px);
		margin: 0 auto;
		margin-top: 100px;
		background-color: var(--surface-background);
		padding: 30px;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.header {
		display: flex;
		align-items: center;
		gap: 20px;
		padding-bottom: 30px;
		margin-bottom: 30px;
		border-bottom: 1px solid var(--border);
	}

	.header h1 {
		display: flex;
		flex-direction: column;
	}

	small {
		font-weight: normal;
		font-size: 0.5em;
	}

	img {
		border-radius: 50%;
	}

	p {
		whitespace: pre;
	}
</style>
