<script lang="ts">
	import Header from '../../components/Header.svelte';
	import EditorCard from '../../components/EditorCard.svelte';
	import type { IUser, ISet } from '$lib/types';
	import { fetchTerms, suggestMoreTerms, publishSet } from '$lib/controllers/createController';
	import {
		AcademicCap,
		DotsHorizontal,
		DotsVertical,
		Icon,
		LockOpen,
		Plus
	} from 'svelte-hero-icons';
	import { cancel } from 'timeago.js';
	export let data: { user: IUser; url: string };

	let setList: ISet[] = [{ term: '', definition: '' }];
	let context: string;
	let suggestions: string[] = [];
	let suggesting = false;

	let autofill = true;
	let bulletpoints = false;
	let summarize = false;

	let descriptor: string;

	const addSetItem = (term: string) => {
		setList.push({ term, definition: '' });
		setList = [...setList];
	};

	const updateSetItem = (index: number, term: string, definition: string) => {
		setList[index] = { term, definition };
		setList = [...setList];
	};

	const removeSetItem = (index: number) => {
		setList = setList.slice(0, index).concat(setList.slice(index + 1));
	};

	const removeSuggestionItem = (index: number) => {
		suggestions.splice(index, 1);
		suggestions = [...suggestions];
	};

	$: {
		descriptor =
			(summarize ? ', summarize for fifth grader' : '') +
			(bulletpoints ? ', summarized bulletpoints' : '');
	}
</script>

<svelte:head>
	<title>Create | Study Bun</title>
</svelte:head>

<Header discordLoginUrl={data.url} user={data.user} />

<main>
	{#if !data.user}
		<span style="text-align: center;"
			><h1>Error</h1>
			<p>You need to be logged in to use this route</p>
		</span>
	{/if}
	{#if data.user}
		<span class="header-info"
			><h1>Create a new study set</h1>
			<small class="status-info"> <Icon width="15px" src={LockOpen} />Public</small></span
		>
		<div style="flex: 1" />
		<button class="preview-btn">Preview</button>
		<button
			on:click={async () => {
				await publishSet(setList, context, data);
				window.location.assign('/library');
			}}
			class="publish-btn">Publish</button
		>
		<input
			type="text"
			bind:value={context}
			class="setname"
			placeholder={`Enter a title, like ${'"Chemistry: Unit 1 - Atomic Structure"'}`}
			on:change={async () => {
				if (autofill) {
					suggestions = await fetchTerms(context);
				}
			}}
		/>
		<textarea placeholder="Optional: Enter a description for the set" class="setdesc" />

		<h3 style="margin-top: 0;">Filters</h3>
		<div class="filters">
			<span style="display: flex; gap: 10px;">
				<button class={!autofill ? 'selected' : ''} on:click={() => (autofill = !autofill)}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
						width="20px"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
						/>
					</svg>
				</button>
				<button
					class={bulletpoints ? 'selected' : ''}
					on:click={() => (bulletpoints = !bulletpoints)}
				>
					<Icon width="20px" src={DotsVertical} />
				</button>
				<button class={summarize ? 'selected' : ''} on:click={() => (summarize = !summarize)}>
					<Icon width="20px" src={AcademicCap} />
				</button>
			</span>
			{#if descriptor && autofill}
				<p>
					{descriptor.replace(', ', '')}
				</p>
			{/if}
			{#if !autofill}
				<p style="color: rgb(247, 68, 68);">Autofill is disabled</p>
			{/if}
		</div>

		<div class="suggestions">
			{#each suggestions as item}
				<span
					on:click={() => {
						addSetItem(item);
						removeSuggestionItem(suggestions.indexOf(item));
					}}>{item}</span
				>
			{/each}

			{#if suggestions.length > 0 && !suggesting}
				<button
					on:click={async () => {
						suggesting = true;
						suggestions = [
							...suggestions,
							...((await suggestMoreTerms(context, suggestions)) || [])
						];
						suggesting = false;
					}}
					class="more-suggestions"
				>
					More Suggestions...</button
				>
			{/if}
		</div>

		{#each setList as item}
			<EditorCard
				{removeSetItem}
				{updateSetItem}
				{descriptor}
				definition={item.definition}
				term={item.term}
				index={setList.indexOf(item)}
				{context}
				{autofill}
			/>
		{/each}

		<button on:click={() => addSetItem('')} class="add"><Icon width="30px" src={Plus} /></button>
	{/if}
</main>

<style>
	main {
		width: min(75%, 1200px);
		margin: 0 auto;
		margin-top: 100px;
		margin-bottom: 30px;
		background-color: var(--surface-background);
		padding: 30px;
		border-radius: 10px;
	}

	.header-info {
		display: flex;
		gap: 10px;
		align-items: baseline;
		flex-wrap: nowrap;
		align-items: center;
	}

	.preview-btn,
	.publish-btn {
		padding: 5px;
		background-color: var(--container-background);
		border: 1px solid var(--border);
		border-radius: 5px;
		cursor: pointer;
		margin: 0;
		margin-bottom: 20px;
		transition-duration: 0.1s;
		color: var(--text-color);
	}

	.publish-btn {
		background-color: #77d084;
		border-color: #589f62;
		color: white;
	}

	.preview-btn:hover,
	.publish-btn:hover {
		transform: translateY(-3px);
	}

	input,
	textarea {
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		font-size: 18px;
		margin-bottom: 20px;
		background-color: var(--container-background);
		border: 1px solid var(--border);
		color: var(--text-color);
		font-family: sans-serif;
	}

	.filters {
		padding: 10px;
		background-color: var(--container-background);
		border: 1px solid var(--border);
		border-radius: 5px;
		margin-bottom: 20px;
	}

	.filters button {
		background-color: var(--background);
		border: 1px solid var(--border);
		border-radius: 5px;
		cursor: pointer;
		transition-duration: 0.1s;
		color: var(--text-color);
		padding: 10px;
	}

	.filters .selected {
		background-color: var(--container-background);
		border: 1px solid var(--border);
		filter: brightness(1.2);
		transform: scale(1.05);
	}

	.filters p {
		margin: 0;
		margin-top: 10px;
		background-color: var(--background);
		border: 1px solid var(--border);
		width: fit-content;
		padding: 10px;
		border-radius: 5px;
	}

	.setname,
	.setdesc {
		width: calc(100% - 20px);
	}

	.status-info {
		display: flex;
		position: relative;
		z-index: 4;
		align-items: center;
		gap: 5px;
		cursor: pointer;
		margin: 10px 0;
	}

	.add {
		background-color: var(--container-background);
		border: 1px solid var(--border);
		border-radius: 50%;
		padding: 10px 12px;
		color: var(--text-color);
		font-size: 18px;
		margin-top: 20px;
		cursor: pointer;
		margin-left: 50%;
		transform: translateX(-50%);
	}

	.suggestions {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		margin-bottom: 20px;
	}

	.more-suggestions {
		padding: 5px;
		background-color: var(--container-background);
		border: 1px solid var(--border);
		color: var(--text-color);
		border-radius: 5px;
		cursor: pointer;
	}

	.suggestions span {
		padding: 5px;
		background-color: var(--background);
		border: 1px solid var(--border);
		color: var(--text-color);
		border-radius: 5px;
		cursor: pointer;
	}

	@media (max-width: 600px) {
		.header-info h1 {
			font-size: 20px;
		}
	}
</style>
