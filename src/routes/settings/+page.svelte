<script lang="ts">
	import type { ISet, IUser } from '$lib/types';
	import { onMount } from 'svelte';
	export let data: { user: IUser; url: string };
	import { theme } from '$lib/stores';

	let themeSelect: HTMLSelectElement;

	// If the user isnt logged in, redirect to login
	onMount(() => {
		if (!data.user) {
			window.location.assign('/');
		}
	});
</script>

{#if data.user}
	<h1>Settings</h1>
	<h3>Site theme</h3>
	<select
		style="margin-bottom: 10px;"
		bind:this={themeSelect}
		on:input={() => theme.set(themeSelect.value)}
		value={$theme}
	>
		<option value="light">Light</option>
		<option value="dark">Dark</option>
		<option value="oceanlight">Ocean Light</option>
	</select>
{/if}

<style>
	select {
		-webkit-appearance: none;
		background-color: var(--container-background);

		border: 1px solid var(--border);
		padding: 10px;
		border-radius: 5px;
		color: var(--text-color);
	}

	h3 {
		margin-bottom: 5px;
	}
</style>
