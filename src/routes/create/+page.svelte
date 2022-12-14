<script lang="ts">
	// Props
	export let data: { user: IUser; url: string };

	// Svelte
	import { onMount } from 'svelte';

	// Types
	import type { IUser, IFlashcard, ISet } from '$lib/types';

	// API
	// import { fetchTerms, suggestMoreTerms, publishSet } from '$lib/controllers/createController';
	import {
		fetch_term_suggestions,
		fetch_more_term_suggestions,
		publish_set
	} from '$lib/api/client';

	// Icons
	import { AcademicCap, DotsVertical, Icon, LockOpen, Plus } from 'svelte-hero-icons';
	import { getSession } from 'lucia-sveltekit/client';
	import type { Session } from 'lucia-sveltekit/types';
	import EditorCardList from '$lib/components/EditorCardList.svelte';

	/* Local State */
	// Bindings
	let context: string; // Binded to the value of the title <input />
	let description: string = ''; // Binded to the value of the description <textarea />
	let session: Session; // Binded to the current session of the user, null if no session

	// Booleans
	let suggesting = false; // Whether or not the API is currently suggesting terms
	let publishing = false; // Whether or not the API is currently publishing the set
	let autofill = true; // Whether or not the user has autofill enabled
	let bulletpoints = false; // Whether or not the user has bulletpoints enabled
	let summarize = false; // Whether or not the user has summarize enabled

	// Other
	let setList: IFlashcard[] = [{ term: '', description: '' }]; // List of flashcards
	let editingSet: string; // The set that is currently being edited, '' if new set
	let suggestions: string[] = []; // Term suggestions from API
	let descriptor: string; // String that is built from the user's selected filters

	// items variable that holds the flashcards in a parsable format
	let items: Array<{ id: number; data: any }>;

	// Gets the session and sets it to the local state
	getSession().subscribe((s) => {
		session = s;
	});

	// Add an empty flashcard to the end of the setList
	const addSetItem = (term: string) => {
		setList.push({ term, description: '' });
		setList = [...setList];
	};

	// Removes a specific suggestion from the suggestions array
	const removeSuggestionItem = (index: number) => {
		suggestions.splice(index, 1);
		suggestions = [...suggestions];
	};

	// Prompts a publish while checking if all values are present
	const promptPublish = async () => {
		if (!context) {
			alert('Please enter a title for your set');
			return faslse;
		}

		setList.forEach((item: IFlashcard) => {
			if (item.description == '' || item.term == '') {
				alert('Please fill out all term and definition fields before publishing');
				return false;
			}
		});

		await publish_set(setList, context, data.user, description, editingSet);
		return true;
	};

	const setListCallBack = (items: Array<any>) => {
		setList = items;
	};

	$: {
		items = setList.map((item, index) => ({ id: index, data: item }));
		descriptor =
			(summarize ? 'summarized for fifth grader ' : '') +
			(bulletpoints ? 'in summarized bulletpoints ' : '');
		setList = [...setList];
	}

	onMount(async () => {
		// If the user isnt logged in, redirect to /
		if (!data.user) {
			window.location.assign('/');
		}

		// Onmount script that fetches the terms from the URL if the user is editing a set, not creating a new one
		const url = window.location.toString();
		const urlParams = new URLSearchParams(url.split('?')[1]);
		const set = urlParams.get('set'); // ?set=...

		if (set) {
			// Fetch details of the set from the API
			const response = fetch('/api/set/fetch', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id: set })
			});

			// Get the JSON data
			const resData = await (await response).json();

			// If we get the set back...
			if (resData.set) {
				// If the owner of the set is not the current user, return
				if (resData.set.userId != data.user.user_id) return;
				editingSet = resData.set.id; // Set the editingSet to the set's ID
				const set: ISet = resData.set; // Set the set variable to the set data
				setList = set.flashcards; // Set the setList to the set's flashcards
				context = set.name; // Change the title (context) to the set's name
				description = set.description; // Set the description to the set's description
			}
		} else {
			setList = [{ term: '', description: '' }];
		}
	});
</script>

<svelte:head>
	<title>Create | Study Bun</title>
</svelte:head>

{#if data.user}
	<span class="header-info"
		><h1 style="margin-bottom: 0;">Create a new study set</h1>
		<small style="margin-bottom: 0;" class="status-info">
			<Icon width="15px" src={LockOpen} />Public</small
		></span
	>
	<div style="flex: 1" />
	<span>
		<button class="preview-btn">Preview</button>
		<button
			on:click={async () => {
				publishing = true;
				const publish = await promptPublish();
				if (publish) {
					window.location.assign('/library');
				}
			}}
			class="publish-btn"
			disabled={publishing}>Publish</button
		>
	</span>
	<input
		type="text"
		bind:value={context}
		class="setname"
		placeholder={`Enter a title, like ${'"Chemistry: Unit 1 - Atomic Structure"'}`}
		on:change={async () => {
			if (autofill) {
				suggestions = (await fetch_term_suggestions(context, session)).terms;
			}
		}}
	/>
	<textarea
		bind:value={description}
		placeholder="Optional: Enter a description for the set"
		class="setdesc"
	/>

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
						...((await fetch_more_term_suggestions(context, suggestions, session)).terms || [])
					];
					suggesting = false;
				}}
				class="more-suggestions"
			>
				More Suggestions...</button
			>
		{/if}
	</div>

	{#if setList.length > 0}
		<EditorCardList {autofill} {setListCallBack} {descriptor} {session} {context} set={setList} />
	{/if}
{/if}

<style>
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
		background-color: var(--light-success);
		border-color: var(--dark-success);
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
