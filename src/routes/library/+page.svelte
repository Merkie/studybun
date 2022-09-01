<script lang="ts">
	import type { IUser } from '$lib/types';
	import Header from '../../components/Header.svelte';
	export let data: { user: IUser; url: string };
</script>

<Header discordLoginUrl={data.url} user={data.user} />

{#each data.sets as item}
	<h3>{item.name}</h3>
	{#each item.flashcards as card}
		<b>Card: {item.flashcards.indexOf(card)}</b>
		<p>Term: {card.term}</p>
		<p>Definition: {card.description}</p>
	{/each}
{/each}
