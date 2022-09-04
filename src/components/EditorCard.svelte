<script lang="ts">
	import type { IDefineResponse } from '$lib/types';
	import { onMount } from 'svelte';
	import { Icon, Photograph, Refresh, Trash } from 'svelte-hero-icons';

	// props
	export let context: string;
	export let index: number;
	export let term: string;
	export let definition: string;
	export let autofill: boolean;

	export let descriptor: string;
	export let removeSetItem: Function;
	export let updateSetItem: Function;

	let refreshButton: HTMLElement;

	const completeDefinition = async () => {
		refreshButton.style.transitionDuration = '1s';
		refreshButton.style.transform = 'rotate(360deg)';
		if (!autofill) return;
		if (!term || !context) return null;
		const response = await fetch('/api/ai/define', {
			method: 'POST',
			body: JSON.stringify({ term: term + descriptor, context })
		});

		const resData: IDefineResponse = JSON.parse(await (await response.blob()).text());
		definition = resData.definition;
		refreshButton.style.transitionDuration = '0s';
		refreshButton.style.transform = 'rotate(0deg)';
	};

	onMount(async () => {
		if (!term) return;
		await completeDefinition();
	});

	$: updateSetItem(index, term, definition);
</script>

<main>
	<span class="header"
		><p>{index + 1}</p>

		<button on:click={completeDefinition}><Icon width="20px" src={Photograph} /></button>
		<button class="refreshButton" bind:this={refreshButton} on:click={completeDefinition}
			><Icon width="20px" src={Refresh} /></button
		>
		<div style="flex: 1;" />
		<button on:click={() => removeSetItem(index)}><Icon width="20px" src={Trash} /></button></span
	>
	<div>
		<span>
			<p>Term</p>
			<textarea
				on:change={completeDefinition}
				bind:value={term}
				rows="4"
				data-gramm="false"
				placeholder="Molecule"
			/>
		</span>
		<span>
			<p>Definition</p>
			<textarea
				bind:value={definition}
				data-gramm="false"
				rows="4"
				placeholder="A group of atoms bonded together..."
			/>
		</span>
	</div>
</main>

<style>
	main {
		background-color: var(--container-background);
		width: calc(100%);
		border-radius: 5px;
		border: var(--border) 1px solid;
		display: flex;
		flex-direction: column;
		margin-bottom: 20px;
	}

	.header {
		border-bottom: var(--border) 1px solid;
		width: calc(100% - 20px);
		padding: 10px;
		display: flex;
		align-items: center;
		flex-direction: row;
	}

	.header button {
		width: fit-content;
		background-color: transparent;
		border: none;
		cursor: pointer;
		/* color: var(--dark-pink); */
		color: var(--text-color);
	}

	div {
		display: flex;
		gap: 10px;
		padding: 10px;
	}

	span {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	/* span * {
		flex: 1;
	} */

	textarea {
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		font-family: sans-serif;
		resize: none;
	}

	p {
		margin: 5px;
		/* color: var(--dark-pink); */
		color: var(--text-color);
		font-weight: bold;
	}

	@media (max-width: 600px) {
		div {
			flex-direction: column;
		}
	}
</style>
