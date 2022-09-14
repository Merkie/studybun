<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import type { IFlashcard } from '$lib/types';
	import { Icon, Photograph, Refresh, Trash, Plus } from 'svelte-hero-icons';
	import { define_from_term, fetch_images } from '$lib/api/client';
	import type { Session } from 'lucia-sveltekit/types';
	import cuid from 'cuid';
	import { dataset_dev } from 'svelte/internal';
	import type { DuckDuckGoImage } from 'duckduckgo-images-api';
	import { themes } from '$lib/themes';
	import { theme } from '$lib/stores';

	const flipDurationMs = 300;

	export let set: IFlashcard[] = [];
	export let session: Session;
	export let context: string;
	export let descriptor: string = '';
	export let setListCallBack: Function;
	export let autofill: boolean;

	let refreshElem: HTMLElement;

	let items: Array<{ id: string; data: any }>;

	// Supporting function for drag and drop action
	const handleDndConsider = (e: { detail: { items: any[] } }) => {
		items = e.detail.items;
	};

	// Supporting function for drag and drop action
	const handleDndFinalize = (e: { detail: { items: any[] } }) => {
		items = e.detail.items;
		setListCallBack(items.map((item) => item.data));
	};

	const autocomplete_definition = async (id: string) => {
		// get the item from the list with the same id
		const item = items.find((item) => item.id === id);
		if (!item) return;
		const definition = await define_from_term(item.data.term + ' ' + descriptor, context, session);
		if (!definition.description) return;

		// update the deinition of the item where the id matches
		items = items.map((item) => {
			if (item.id === id) {
				return {
					...item,
					data: {
						...item.data,
						description: definition.description
					}
				};
			}
			return item;
		});
		setListCallBack(items.map((item) => item.data));
	};

	const autocomplete_thumbnail_suggestions = async (id: string) => {
		// get the item from the list with the same id
		const item = items.find((item) => item.id === id);
		const image_suggestions: DuckDuckGoImage[] = (await fetch_images(item.data.term)).images;
		// add image suggestions to the item with the same id
		items = items.map((item) => {
			if (item.id === id) {
				return {
					...item,
					data: {
						...item.data,
						image_suggestions: image_suggestions || [],
						image_suggestions_showing: true
					}
				};
			}
			return item;
		});
	};

	const refresh = async (id: string) => {
		document.getElementById('refresh-' + id)?.classList.add('animate-spin');
		// refreshElem.style.transform = 'rotate(360deg)';
		if (autofill) {
			await autocomplete_definition(id);
		}
		await autocomplete_thumbnail_suggestions(id);
		setListCallBack(items.map((item) => item.data));
		document.getElementById('refresh-' + id)?.classList.remove('animate-spin');
	};

	const remove_card = async (id: string) => {
		items = items.filter((item) => item.id !== id);
		setListCallBack(items.map((item) => item.data));
	};

	const change_image = async (id: string, image_url: string) => {
		// get the item from the list with the same id
		const item = items.find((item) => item.id === id);
		// add image suggestions to the item with the same id
		items = items.map((item) => {
			if (item.id === id) {
				return {
					...item,
					data: {
						...item.data,
						image: image_url
					}
				};
			}
			return item;
		});
		setListCallBack(items.map((item) => item.data));
	};

	const indexToBrightness = (index: number) => {
		const firstNumber = parseInt(index / 10 + '') + 1;
		if (firstNumber % 2 == 0) {
			return (9 - (index % 10)) / 10;
		}
		return ((index % 10) + 1) / 10;
	};

	$: {
		items = set.map((item) => ({ id: item.id, data: item }));
	}
</script>

<section
	use:dndzone={{ items, flipDurationMs, dropTargetStyle: { opacity: '0.5' } }}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
>
	{#each items as item, index (item.id)}
		<div class="card-main" animate:flip={{ duration: flipDurationMs }}>
			<span
				class="card-background"
				style={`filter:
				hue-rotate(${indexToBrightness(index) * themes[$theme].hueRotate}deg)`}
			/>
			<span class="header"
				><p>{index + 1}</p>
				<button on:click={() => {}}><Icon width="20px" src={Photograph} /></button>
				<input on:change={() => {}} type="file" style="display: none;" />
				<button id={'refresh-' + item.id} class="refreshButton" on:click={() => refresh(item.id)}
					><Icon width="20px" src={Refresh} /></button
				>

				{#if item.data.image_suggestions_showing == false}
					<button
						class="show-suggestions"
						on:click={() => (item.data.image_suggestions_showing = true)}
					>
						Show Suggestions
					</button>
				{/if}

				<div style="flex: 1;" />
				<button on:click={() => remove_card(item.id + '')}><Icon width="20px" src={Trash} /></button
				>
			</span>
			<div>
				<span>
					<p>Term</p>
					<textarea
						class={`term ${item.data.image ? 'term-img' : ''}`}
						on:change={() => refresh(item.id + '')}
						bind:value={item.data.term}
						rows="4"
						data-gramm="false"
						placeholder="Molecule"
					/>
				</span>
				<span>
					<p>Definition</p>
					<textarea
						class={item.data.image ? 'def-img' : ''}
						bind:value={item.data.description}
						data-gramm="false"
						rows="4"
						placeholder="A group of atoms bonded together..."
					/>
				</span>
				{#if item.data.image}
					<span style="flex-grow: 0;">
						<p style="display: flex; align-items: center; gap: 10px;">
							Image <span on:click={() => (item.data.image = '')}
								><Icon width="17px" src={Trash} /></span
							>
						</p>
						<img width="100px" src={item.data.image} alt="" />
					</span>
				{/if}
			</div>
			{#if item.data.image_suggestions}
				{#if item.data.image_suggestions_showing}
					<span class="thumbnail-suggestions">
						<button class="xbtn" on:click={() => (item.data.image_suggestions_showing = false)}>
							<svg
								width="40px"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
						{#each item.data.image_suggestions as image}
							<img
								on:click={() => change_image(item.id, image.thumbnail)}
								style="width: 50px; height:50px; border-radius: 10px;"
								src={image.thumbnail}
								alt="thumbnail"
							/>
						{/each}
					</span>
				{/if}
			{/if}
		</div>
	{/each}
</section>

<button
	on:click={() => (set = [...set, { id: cuid() }])}
	class="add-btn"
	style="height: 60px; width: 60px;"><Icon width="30px" src={Plus} /></button
>

<style>
	.card-main {
		background-color: var(--container-background);
		color: var(--container-text-color) !important;
		width: calc(100% - 20px);
		border-radius: 5px;
		border: var(--border) 1px solid;
		display: flex;
		flex-direction: column;
		margin-bottom: 20px;
		position: relative;
	}

	.card-background {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		position: absolute;
		border-radius: 5px;
		background-color: var(--container-background);
		z-index: 1;
	}

	.card-main * {
		z-index: 2;
	}

	.animate-spin {
		animation: spin 2s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.refreshButton {
		transition-duration: 0.5s;
	}

	.thumbnail-suggestions {
		display: flex;
		flex-direction: row !important;
		gap: 10px;
		padding-bottom: 10px;
		padding-left: 10px;
		overflow-x: scroll;
	}

	.thumbnail-suggestions img {
		cursor: pointer;
		transition-duration: 0.2s;
	}

	.thumbnail-suggestions img:hover {
		transform: scale(1.1);
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

	.show-suggestions {
		background-color: var(--container-background-color) !important;
		padding: 5px 10px;
		border: 1px solid var(--text-color) !important;
		border-radius: 5px;
		cursor: pointer;
	}

	.add-btn {
		margin: 0 auto;
		background-color: var(--container-background);
		border-radius: 50%;
		border: 1px solid var(--border);
		color: var(--text-color);
		padding: 10px;
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

	/* .term {
		width: calc(100% - 30px);
	} */

	.term-img {
		width: calc(100% + 32px);
	}

	.def-img {
		transform: translateX(53px);
		width: calc(100% - 74px);
	}

	p {
		margin: 5px;
		/* color: var(--dark-pink); */
		/* color: var(--text-color); */
		font-weight: bold;
	}

	.xbtn {
		background-color: transparent;
		border: none;
		cursor: pointer;
		color: var(--text-color);
	}

	@media (max-width: 700px) {
		div {
			flex-direction: column;
		}

		.term-img {
			width: auto !important;
		}

		.def-img {
			width: auto;
			transform: none !important;
		}
	}
</style>
