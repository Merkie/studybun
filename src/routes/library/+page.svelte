<script lang="ts">
	import type { ISet, ISetDisplay, IUser } from '$lib/types';
	import SetDisplayCard from '$lib/components/SetDisplayCard.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { onMount } from 'svelte';
	import { delete_set } from '$lib/api/client';
	import { getSession } from 'lucia-sveltekit/client';
	import type { Session } from 'lucia-sveltekit/types';
	export let data: { user: IUser; url: string; sets: ISetDisplay[] };

	let modalMessage = ''; // The message to display in the modal
	let modalObject: { [key: string]: Function }; // The object of options to display in the modal
	let modalOpen = false; // Whether or not the modal is open
	let deleteIndex: number;

	let session: Session;

	getSession().subscribe((s) => {
		session = s;
	});

	// Callback function that prompts the deletion of a card
	// TODO: rewrite?
	const promptDelete = (id: string) => {
		modalMessage = 'Are you sure you want to delete this set?';
		modalObject = {
			'Yes, delete this': async () => {
				await delete_set(id, session);
				window.location.assign('/library');
				modalOpen = false;
			}
		};
		modalOpen = true;
	};

	// If the user isnt logged in, redirect to login
	onMount(() => {
		if (!data.user) {
			window.location.assign('/');
		}
	});
</script>

{#if data.user}
	<h1>Your study sets</h1>
	<span style="display: flex; flex-wrap: wrap; gap: 30px;">
		{#each data.sets as item, index}
			<SetDisplayCard {index} promptDelete={(id) => promptDelete(id)} edit={true} {...item} />
		{/each}
	</span>
{/if}

{#if modalOpen}
	<Modal
		message="Are you sure you want to delete this study set?"
		options={modalObject}
		close={() => (modalOpen = false)}
	/>
{/if}
