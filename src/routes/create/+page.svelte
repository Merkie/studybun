<script lang="ts">
	import Header from '../../components/Header.svelte';
	import EditorCard from '../../components/EditorCard.svelte';
	import type { IUser } from '$lib/types';
	import { Icon, InformationCircle } from 'svelte-hero-icons';
	export let data: { user: IUser; url: string };
</script>

<svelte:head>
	<title>Create | Study Bun</title>
</svelte:head>

<Header discordLoginUrl={data.url} user={data.user} />

<main>
	<span style="display: flex; gap: 10px; align-items: baseline;" class="header-info"
		><h1>Create a new study set</h1>

		<small class="status-info"
			><div class="tooltip">
				<p>This set will show up on search results and your profile, but only you can edit it.</p>
			</div>
			<Icon width="15px" src={InformationCircle} />Public</small
		></span
	>
	<div style="flex: 1" />
	<input
		type="text"
		class="setname"
		placeholder={`Enter a title, like ${'"Biology - Chapter 22: Evolution"'}`}
	/>
	<textarea placeholder="Optional: Enter a description for the set" class="setdesc" />

	<EditorCard />
</main>

<style>
	main {
		width: min(75%, 1200px);
		margin: 0 auto;
		background-color: white;
		padding: 30px;
		margin-top: 20px;
		border-radius: 10px;
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
</style>
