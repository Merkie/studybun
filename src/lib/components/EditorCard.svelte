<script lang="ts">
	import type { IDefineResponse } from '$lib/types';
	import { onMount } from 'svelte';
	import { Icon, Photograph, Refresh, Trash } from 'svelte-hero-icons';
	import ImageResize from 'image-resize';
	import imageToBase64 from 'image-to-base64/browser';
	import { define_from_term, fetch_images } from '$lib/api';
	import type { DuckDuckGoImage } from 'duckduckgo-images-api';

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

	let imageSuggestionsVisible = false;

	let imageSuggestions: DuckDuckGoImage[] = [];

	let refreshButton: HTMLElement;
	let fileInput: HTMLInputElement;

	const completedescription = async () => {
		refreshButton.style.transitionDuration = '1s';
		refreshButton.style.transform = 'rotate(360deg)';
		if (!autofill) return;
		if (!term || !context) return null;
		description = (await define_from_term(term + descriptor, context, userId)).description;
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

	const fetchImages = async () => {
		imageSuggestionsVisible = false;
		imageSuggestions = (await fetch_images(term)).images;
	};

	const setImageFromUrl = async (url: string) => {
		const response = await imageToBase64(url);
		imagesrc = 'data:image/png;base64,' + response;
	};

	onMount(async () => {
		if (!term || description) return;
		await refresh();
	});

	const refresh = async () => {
		await completedescription();
		await fetchImages();
	};

	$: {
		const response = updateSetItem(index, term, description, imagesrc);
	}
</script>

<main>
	<span class="header"
		><p>{index + 1}</p>

		<button on:click={promptUpload}><Icon width="20px" src={Photograph} /></button>
		<input on:change={handleImageUpload} type="file" bind:this={fileInput} style="display: none;" />
		<button class="refreshButton" bind:this={refreshButton} on:click={refresh}
			><Icon width="20px" src={Refresh} /></button
		>
		<div style="flex: 1;" />
		<button on:click={() => removeSetItem(index)}><Icon width="20px" src={Trash} /></button></span
	>
	<div>
		<span>
			<p>Term</p>
			<textarea
				on:change={refresh}
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

	{#if imageSuggestions.length > 1 && !imageSuggestionsVisible}
		<p
			style="padding: 10px; padding-top: 0; margin: 0; color: var(--border); text-decoration: underline; font-weight: normal; cursor: pointer;"
			on:click={() => (imageSuggestionsVisible = !imageSuggestionsVisible)}
		>
			See thumbnail suggestions...
		</p>
	{/if}

	<div
		style={'margin-top: 0; align-items: center; padding-top: 0; gap: 10px; flex-wrap: wrap; flex-direction: row !important; display: ' +
			(imageSuggestionsVisible ? 'flex' : 'none')}
	>
		<button
			style="background: none; border: none; cursor: pointer;"
			on:click={() => (imageSuggestionsVisible = false)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				width="30px"
				height="30px"
				color="var(--text-color)"
			>
				<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>

		{#each imageSuggestions as image}
			<img
				on:click={() => setImageFromUrl(image.thumbnail)}
				src={image.thumbnail}
				class="thumbnail-icon"
				width="50px"
				height="50px"
				alt=""
			/>
		{/each}
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

	.thumbnail-icon {
		background-color: white;
		border-radius: 10px;
		transition-duration: 0.2s;
		cursor: pointer;
	}

	.thumbnail-icon:hover {
		transform: scale(1.05);
		filter: brightness(1.1);
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
