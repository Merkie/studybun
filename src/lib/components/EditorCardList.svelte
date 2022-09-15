<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone, SOURCES, TRIGGERS } from 'svelte-dnd-action';
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

	let dragDisabled = true;

	function handleDndConsider(e) {
		const {
			items: newItems,
			info: { source, trigger }
		} = e.detail;
		items = newItems;
		// Ensure dragging is stopped on drag finish via keyboard
		if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
			dragDisabled = true;
		}
	}
	function handleDndFinalize(e) {
		const {
			items: newItems,
			info: { source }
		} = e.detail;
		items = newItems;
		// Ensure dragging is stopped on drag finish via pointer (mouse, touch)
		if (source === SOURCES.POINTER) {
			dragDisabled = true;
		}
		setListCallBack(items.map((item) => item.data));
	}
	function startDrag(e) {
		// preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
		e.preventDefault();
		dragDisabled = false;
	}
	function handleKeyDown(e) {
		if ((e.key === 'Enter' || e.key === ' ') && dragDisabled) dragDisabled = false;
	}

	// // Supporting function for drag and drop action
	// const handleDndConsider = (e: { detail: { items: any[] } }) => {
	// 	items = e.detail.items;
	// };

	// // Supporting function for drag and drop action
	// const handleDndFinalize = (e: { detail: { items: any[] } }) => {
	// 	items = e.detail.items;

	// };

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
	use:dndzone={{ items, dragDisabled, flipDurationMs, dropTargetStyle: { opacity: '0.5' } }}
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
			<span class="header">
				<p>{index + 1}</p>
				<button on:click={() => {}}><Icon width="20px" src={Photograph} /></button>
				<input on:change={() => {}} type="file" style="display: none;" />
				<button id={'refresh-' + item.id} class="refreshButton" on:click={() => refresh(item.id)}
					><Icon width="20px" src={Refresh} /></button
				>

				<div
					tabindex={dragDisabled ? 0 : -1}
					aria-label="drag-handle"
					class="handle"
					style={dragDisabled ? 'cursor: grab' : 'cursor: grabbing'}
					on:mousedown={startDrag}
					on:touchstart={startDrag}
					on:keydown={handleKeyDown}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						x="0px"
						y="0px"
						width="20"
						height="20"
						viewBox="0 0 50 50"
						style=" fill:var(--text-color);"
						><path
							d="M 25 0.09375 L 16.09375 9 C 15.570313 9.5 15.355469 10.242188 15.535156 10.945313 C 15.714844 11.644531 16.257813 12.195313 16.957031 12.382813 C 17.65625 12.570313 18.402344 12.363281 18.90625 11.84375 L 23 7.75 L 23 23 L 7.6875 23 L 11.78125 18.90625 C 12.375 18.332031 12.554688 17.457031 12.234375 16.695313 C 11.917969 15.9375 11.167969 15.449219 10.34375 15.46875 C 9.820313 15.488281 9.328125 15.714844 8.96875 16.09375 L 0.0625 25 L 8.96875 33.90625 C 9.449219 34.503906 10.226563 34.773438 10.972656 34.601563 C 11.722656 34.429688 12.304688 33.847656 12.476563 33.097656 C 12.648438 32.351563 12.378906 31.574219 11.78125 31.09375 L 7.6875 27 L 23 27 L 23 42.28125 L 18.90625 38.1875 C 18.53125 37.792969 18.011719 37.566406 17.46875 37.5625 C 16.65625 37.570313 15.929688 38.066406 15.628906 38.820313 C 15.324219 39.574219 15.511719 40.433594 16.09375 41 L 23.59375 48.5 L 25 49.9375 L 26.40625 48.5 L 33.90625 41 C 34.503906 40.519531 34.773438 39.742188 34.601563 38.996094 C 34.429688 38.246094 33.847656 37.664063 33.097656 37.492188 C 32.351563 37.320313 31.574219 37.589844 31.09375 38.1875 L 27 42.28125 L 27 27 L 42.25 27 L 38.15625 31.09375 C 37.558594 31.574219 37.289063 32.351563 37.460938 33.097656 C 37.632813 33.847656 38.214844 34.429688 38.964844 34.601563 C 39.710938 34.773438 40.488281 34.503906 40.96875 33.90625 L 48.46875 26.40625 L 49.90625 25 L 48.46875 23.59375 L 40.96875 16.09375 C 40.59375 15.699219 40.074219 15.472656 39.53125 15.46875 C 39.46875 15.464844 39.40625 15.464844 39.34375 15.46875 C 38.566406 15.542969 37.902344 16.066406 37.648438 16.804688 C 37.390625 17.546875 37.589844 18.367188 38.15625 18.90625 L 42.25 23 L 27 23 L 27 7.75 L 31.09375 11.84375 C 31.597656 12.363281 32.34375 12.570313 33.042969 12.382813 C 33.742188 12.195313 34.285156 11.644531 34.464844 10.945313 C 34.644531 10.242188 34.429688 9.5 33.90625 9 Z"
						/></svg
					>
				</div>

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
