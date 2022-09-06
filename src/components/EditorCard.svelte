<script lang="ts">
	import type { IDefineResponse } from '$lib/types';
	import { onMount } from 'svelte';
	import { Icon, Photograph, Refresh, Trash } from 'svelte-hero-icons';
	import ImageResize from 'image-resize';

	// props
	export let context: string;
	export let index: number;
	export let term: string;
	export let description: string;
	export let imagesrc: string;
	export let autofill: boolean;
	export let userId: string;

	export let descriptor: string;
	export let removeSetItem: Function;
	export let updateSetItem: Function;

	let refreshButton: HTMLElement;
	let fileInput: HTMLInputElement;

	const completedescription = async () => {
		refreshButton.style.transitionDuration = '1s';
		refreshButton.style.transform = 'rotate(360deg)';
		if (!autofill) return;
		if (!term || !context) return null;
		const response = await fetch('/api/ai/define', {
			method: 'POST',
			body: JSON.stringify({ term: term + descriptor, context, userId })
		});

		const resData: IDefineResponse = JSON.parse(await (await response.blob()).text());
		description = resData.description;
		refreshButton.style.transitionDuration = '0s';
		refreshButton.style.transform = 'rotate(0deg)';
	};

	const promptUpload = () => {
		fileInput.click();
	};

	const handleImageUpload = async () => {
		if (!fileInput.files) return;
		const file = fileInput.files[0];
		if (!file) return;

		var imageResize = new ImageResize({
			format: 'png',
			width: 640
		});
		const img = await imageResize.play(file);
		imagesrc = img.toString();
	};

	onMount(async () => {
		if (!term || description) return;
		await completedescription();
	});
	5;
	$: {
		const response = updateSetItem(index, term, description, imagesrc);
	}
</script>

<main>
	<span class="header"
		><p>{index + 1}</p>

		<button on:click={promptUpload}><Icon width="20px" src={Photograph} /></button>
		<input on:change={handleImageUpload} type="file" bind:this={fileInput} style="display: none;" />
		<button class="refreshButton" bind:this={refreshButton} on:click={completedescription}
			><Icon width="20px" src={Refresh} /></button
		>
		<div style="flex: 1;" />
		<button on:click={() => removeSetItem(index)}><Icon width="20px" src={Trash} /></button></span
	>
	<div>
		<span>
			<p>Term</p>
			<textarea
				on:change={completedescription}
				bind:value={term}
				rows="4"
				data-gramm="false"
				placeholder="Molecule"
			/>
		</span>
		<span>
			<p>description</p>
			<textarea
				bind:value={description}
				data-gramm="false"
				rows="4"
				placeholder="A group of atoms bonded together..."
			/>
		</span>
		{#if imagesrc}
			<span style="flex-grow: 0;">
				<p style="display: flex; align-items: center; gap: 10px;">
					Image <span on:click={() => (imagesrc = '')}><Icon width="17px" src={Trash} /></span>
				</p>
				<img width="100px" src={imagesrc} alt="" />
			</span>
		{/if}
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
