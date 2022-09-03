<script lang="ts">
	import Header from '../../components/Header.svelte';
	import EditorCard from '../../components/EditorCard.svelte';
	import type { IUser, ISet } from '$lib/types';
	import { fetchTerms, suggestMoreTerms, publishSet } from '$lib/controllers/createController';
	import { Icon, LockOpen, Plus } from 'svelte-hero-icons';
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

	<span style="display: flex; flex-direction: column; gap: 5px;">
		<span>
			<label for="autofill">AI Suggestions</label>
			<input bind:checked={autofill} type="checkbox" id="autofill" />
		</span>
		<span>
			<label for="bullets">Bulletpoints</label>
			<input bind:checked={bulletpoints} type="checkbox" id="bullets" />
		</span>
		<span>
			<label for="summary">Summarize for fifth grader</label>
			<input bind:checked={summarize} type="checkbox" id="summary" />
		</span>
	</span>

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
					suggestions = [...suggestions, ...((await suggestMoreTerms(context, suggestions)) || [])];
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
