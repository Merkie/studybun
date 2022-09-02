<script lang="ts">
	import type { IUser } from '$lib/types';
	import Header from '../../components/Header.svelte';
	export let data: { user: IUser; url: string };
</script>

<Header discordLoginUrl={data.url} user={data.user} />
<!-- 
{#each data.sets as item}
	<h3>{item.name}</h3>
	{#each item.flashcards as card}
		<b>Card: {item.flashcards.indexOf(card)}</b>
		<p>Term: {card.term}</p>
		<p>Definition: {card.description}</p>
	{/each}
{/each} -->

<main>
	<h1>Your study sets</h1>
	<span style="display: flex; flex-wrap: wrap; gap: 30px;">
		{#each data.sets as item}
			<div on:click={() => window.location.assign('/set/' + item.id)}>
				<p>
					{item.name}<span class="subtext">{item.flashcards.length} terms</span>
				</p>
				<p style="margin-top: 10px; font-weight: normal;">Created by you</p>
			</div>
		{/each}
	</span>
</main>

<style>
	main {
		width: min(75%, 1200px);
		margin: 0 auto;
		background-color: var(--surface-background);
		padding: 30px;
		margin-top: 20px;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	div {
		padding: 20px;
		background-color: var(--med-pink);
		border: 1px solid var(--border);
		border-radius: 10px;
		font-size: 18px;
		font-weight: bold;
		margin: 0;
		width: fit-content;
		cursor: pointer;
		transition-duration: 0.1s;
	}
	div:hover {
		transform: translateY(-3px);
	}

	p {
		margin: 0;
	}

	.subtext {
		font-size: 16px;
		font-weight: normal;
		margin-left: 10px;
	}
</style>
