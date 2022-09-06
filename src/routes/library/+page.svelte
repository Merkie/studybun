<script lang="ts">
	import type { ISet, IUser } from '$lib/types';
	import SetDisplayCard from '../../components/SetDisplayCard.svelte';
	import Modal from '../../components/Modal.svelte';
	import { setMaxListeners } from 'discord-oauth2';
	import { onMount } from 'svelte';
	export let data: { user: IUser; url: string; sets: ISet[] };

	let modalMessage = ''; // The message to display in the modal
	let modalObject: { [key: string]: Function }; // The object of options to display in the modal
	let modalOpen = false; // Whether or not the modal is open
	let deleteIndex: number;

	// Callback function that prompts the deletion of a card
	// TODO: rewrite?
	const promptDelete = () => {
		modalMessage = 'Are you sure you want to delete this set?';
		modalObject = {
			'Yes, delete this': async () => {
				await fetch('/api/set/delete', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						id: data.sets[deleteIndex].id
					})
				});

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
		{#each data.sets as item}
			<SetDisplayCard
				index={data.sets.indexOf(item)}
				indexCallback={(index) => (deleteIndex = index)}
				{promptDelete}
				edit={true}
				set={item}
			/>
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
