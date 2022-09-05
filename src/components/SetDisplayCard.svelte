<script lang="ts">
	import { format } from 'timeago.js';
	import { Icon, Pencil, Trash } from 'svelte-hero-icons';
	import type { ISet } from '$lib/types';
	export let set: ISet;
	export let edit: boolean;
	export let index: number;
	export let promptDelete: Function;
	export let indexCallback: Function;
</script>

<div>
	<span class="header">
		<span on:click={() => window.location.assign('/set/' + set.id)}>{set.name} </span>
		{#if edit}
			<span class="desktop-icon">
				<span on:click={() => window.location.assign('/create?set=' + set.id)}>
					<Icon src={Pencil} width="18px" />
				</span>
				<span style="flex: 1" />
				<span
					on:click={() => {
						promptDelete();
						indexCallback(index);
					}}
				>
					<Icon src={Trash} width="18px" />
				</span>
			</span>
		{/if}
	</span>
	<span class="subtext">
		Created by <a href={`/profile/${set.author.id}`}>{set.author.name}</a> • {set.flashcards.length}
		Terms • {format(set.createdAt)}
	</span>
	<span class="mobile-icon">
		<span on:click={() => window.location.assign('/create?set=' + set.id)}>
			<Icon class="desktop-icon" src={Pencil} width="22px" />
		</span>
		<span class="desktop-icon" style="flex: 1" />
		<Icon class="desktop-icon" src={Trash} width="22px" />
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

	.header {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	div:hover {
		transform: translateY(-3px);
	}

	.subtext {
		font-size: 16px;
		font-weight: normal;
	}

	.mobile-icon {
		display: none;
		justify-content: space-between;
		margin-top: 5px;
	}

	@media (max-width: 650px) {
		.desktop-icon {
			display: none;
		}

		.mobile-icon {
			display: flex;
		}
	}
</style>
