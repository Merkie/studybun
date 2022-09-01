<script lang="ts">
	import Header from '../../components/Header.svelte';
	import EditorCard from '../../components/EditorCard.svelte';
	import type { IUser } from '$lib/types';
	import { Icon, InformationCircle, Plus } from 'svelte-hero-icons';
	export let data: { user: IUser; url: string };

	let setList = [{ term: '', definition: '' }];
	let context: string;
	let suggestions: string[] = [];
	let suggesting = false;

	const addSet = (term: string) => {
		setList.push({ term, definition: '' });
		setList = [...setList];
	};

	const updateSetItem = (index: number, term: string, definition: string) => {
		setList[index] = { term, definition };
		setList = [...setList];
	};

	const fetchTerms = async () => {
		if (!context) return;
		const response = await fetch('/api/ai/list', {
			method: 'POST',
			body: JSON.stringify({ context })
		});

		const resData = JSON.parse(await (await response.blob()).text());
		suggestions = resData.terms;
	};

	const removeSetItem = (index: number) => {
		setList.splice(index, 1);
		setList = [...setList];
	};

	const removeSuggestionItem = (index: number) => {
		suggestions.splice(index, 1);
		suggestions = [...suggestions];
	};

	const suggestMoreTerms = async () => {
		if (!context) return;
		suggesting = true;
		const response = await fetch('/api/ai/list', {
			method: 'POST',
			body: JSON.stringify({ context, suggestions })
		});

		// Grab json data from response
		const resData = JSON.parse(await (await response.blob()).text());

		if (!resData.terms) return; // If no terms, return

		// Add new terms to the list
		suggestions = [...suggestions, ...resData.terms];
		suggesting = false;
	};

	const publishSet = async () => {
		const response = fetch('/api/user/publish', {
			method: 'POST',
			body: JSON.stringify({ set: setList, context: context, user: data.user.user_id })
		});
	};
</script>

<svelte:head>
	<title>Create | Study Bun</title>
</svelte:head>

<Header discordLoginUrl={data.url} user={data.user} />

<main>
	<span class="header-info"
		><h1>Create a new study set</h1>
		<small class="status-info"
			><div class="tooltip">
				<p>This set will show up on search results and your profile, but only you can edit it.</p>
			</div>
			<Icon width="15px" src={InformationCircle} />Public</small
		></span
	>
	<div style="flex: 1" />
	<button class="preview-btn">Preview</button>
	<button on:click={publishSet} class="publish-btn">Publish</button>
	<input
		type="text"
		bind:value={context}
		class="setname"
		placeholder={`Enter a title, like ${'"Chemistry: Unit 1 - Atomic Structure"'}`}
		on:change={fetchTerms}
	/>
	<textarea placeholder="Optional: Enter a description for the set" class="setdesc" />

	<div class="suggestions">
		{#each suggestions as item}
			<span
				on:click={() => {
					addSet(item);
					removeSuggestionItem(suggestions.indexOf(item));
				}}>{item}</span
			>
		{/each}

		{#if suggestions.length > 0 && !suggesting}
			<button on:click={suggestMoreTerms}>More Suggestions...</button>
		{/if}
	</div>

	{#each setList as item}
		<EditorCard
			{removeSetItem}
			{updateSetItem}
			term={item.term}
			index={setList.indexOf(item)}
			{context}
		/>
	{/each}

	<button on:click={() => addSet('')} class="add"><Icon width="30px" src={Plus} /></button>
</main>

<style>
	main {
		width: min(75%, 1200px);
		margin: 0 auto;
		background-color: var(--surface-background);
		padding: 30px;
		margin-top: 20px;
		border-radius: 10px;
	}

	.header-info {
		display: flex;
		gap: 10px;
		align-items: baseline;
		flex-wrap: wrap;
		align-items: center;
	}

	.preview-btn,
	.publish-btn {
		padding: 5px;
		background-color: var(--light-pink);
		border: 1px solid var(--border);
		color: var(--dark-pink);
		border-radius: 5px;
		cursor: pointer;
		margin: 0;
		margin-bottom: 20px;
		transition-duration: 0.1s;
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
		/* background-color: var(--light-pink); */
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
	}

	.tooltip {
		position: absolute;
		top: -50px;
		right: 100%;
		background-color: var(--light-pink);
		filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.2));
		width: 300px;
		padding: 10px;
		height: fit-content;
		display: none;
		border-radius: 5px;
	}

	.status-info:hover .tooltip {
		display: block;
	}

	.add {
		background-color: var(--light-pink);
		border: 1px solid var(--border);
		border-radius: 50%;
		padding: 10px 12px;
		color: var(--dark-pink);
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

	.suggestions span {
		padding: 5px;
		background-color: var(--light-pink);
		border: 1px solid var(--border);
		color: var(--dark-pink);
		border-radius: 5px;
		cursor: pointer;
	}

	@media (max-width: 600px) {
		h1 {
			font-size: 25px;
		}
	}
</style>
