<script lang="ts">
	import { format } from 'timeago.js';
	import type { ISet } from '$lib/types';
	export let set: ISet;
</script>

<div>
	<span on:click={() => window.location.assign('/set/' + set.id)}>
		{set.name}
	</span>
	<span class="subtext">
		Created by <a href={`/profile/${set.author.id}`}>{set.author.name}</a> • {set.flashcards.length}
		Terms • {format(set.createdAt)}
	</span>
</div>

<style>
	div {
		padding: 20px;
		background-color: var(--container-background);
		border: 1px solid var(--border);
		border-radius: 10px;
		font-size: 18px;
		font-weight: bold;
		margin: 0;
		width: fit-content;
		cursor: pointer;
		transition-duration: 0.1s;
		z-index: 1;
		display: flex;
		flex-direction: column;
		gap: 10px;
		flex-grow: 1;
		flex-shrink: 0;
	}

	div:hover {
		transform: translateY(-3px);
	}

	.subtext {
		font-size: 16px;
		font-weight: normal;
	}
</style>
