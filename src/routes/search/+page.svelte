<script lang="ts">
	import type { ISet, IUser } from '$lib/types';
	import SetDisplayCard from '$lib/components/SetDisplayCard.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { search_sets } from '$lib/api/client';
	import { dataset_dev } from 'svelte/internal';

	export let data: { user: IUser; saved: string[] };
	let sets: ISet[];
	let searching = true;
	let spinner: HTMLDivElement;

	const search = async (query: string) => {
		sets = (await search_sets(query)).sets;
		searching = false;
	};

	onMount(async () => {
		await search($page.url.searchParams.get('term')?.replace(' ', ' & ') || '');
	});

	// TODO: Can I move this logic into a load function so the user doesnt see a blank screen?
	// Issue is getting the slug into the load function.
</script>

<svelte:head>
	<title>Search | Study Bun</title>
</svelte:head>

<h1>Study sets that match the term "{$page.url.searchParams.get('term')}"</h1>
<span style="display: flex; flex-wrap: wrap; gap: 30px;">
	{#if sets}
		{#each sets as item}
			<SetDisplayCard saved={data.saved} index={sets.indexOf(item)} {...item} />
		{/each}
		{#if sets.length < 1}
			<h1 style="text-align: center; width: 100%;">Nothing here 👻</h1>
		{/if}
	{/if}
</span>

{#if searching}
	<div class="spinner loadingio-spinner-spinner-hhvncee1kg">
		<div class="ldio-pvvi8rfsy39">
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
		</div>
	</div>
{/if}

<style type="text/css">
	@keyframes ldio-pvvi8rfsy39 {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	.spinner {
		margin: 0 auto;
		transform: scale(0.5);
		transition-duration: 0.5s;
	}
	.ldio-pvvi8rfsy39 div {
		left: 94px;
		top: 20px;
		position: absolute;
		animation: ldio-pvvi8rfsy39 linear 1s infinite;
		background: var(--spinner-color);
		width: 12px;
		height: 24px;
		border-radius: 3.6px / 3.6px;
		transform-origin: 6px 80px;
	}
	.ldio-pvvi8rfsy39 div:nth-child(1) {
		transform: rotate(0deg);
		animation-delay: -0.9166666666666666s;
		background: var(--spinner-color);
	}
	.ldio-pvvi8rfsy39 div:nth-child(2) {
		transform: rotate(30deg);
		animation-delay: -0.8333333333333334s;
		background: var(--spinner-color);
	}
	.ldio-pvvi8rfsy39 div:nth-child(3) {
		transform: rotate(60deg);
		animation-delay: -0.75s;
		background: var(--spinner-color);
	}
	.ldio-pvvi8rfsy39 div:nth-child(4) {
		transform: rotate(90deg);
		animation-delay: -0.6666666666666666s;
		background: var(--spinner-color);
	}
	.ldio-pvvi8rfsy39 div:nth-child(5) {
		transform: rotate(120deg);
		animation-delay: -0.5833333333333334s;
		background: var(--spinner-color);
	}
	.ldio-pvvi8rfsy39 div:nth-child(6) {
		transform: rotate(150deg);
		animation-delay: -0.5s;
		background: var(--spinner-color);
	}
	.ldio-pvvi8rfsy39 div:nth-child(7) {
		transform: rotate(180deg);
		animation-delay: -0.4166666666666667s;
		background: var(--spinner-color);
	}
	.ldio-pvvi8rfsy39 div:nth-child(8) {
		transform: rotate(210deg);
		animation-delay: -0.3333333333333333s;
		background: var(--spinner-color);
	}
	.ldio-pvvi8rfsy39 div:nth-child(9) {
		transform: rotate(240deg);
		animation-delay: -0.25s;
		background: var(--spinner-color);
	}
	.ldio-pvvi8rfsy39 div:nth-child(10) {
		transform: rotate(270deg);
		animation-delay: -0.16666666666666666s;
		background: var(--spinner-color);
	}
	.ldio-pvvi8rfsy39 div:nth-child(11) {
		transform: rotate(300deg);
		animation-delay: -0.08333333333333333s;
		background: var(--spinner-color);
	}
	.ldio-pvvi8rfsy39 div:nth-child(12) {
		transform: rotate(330deg);
		animation-delay: 0s;
		background: var(--spinner-color);
	}
	.loadingio-spinner-spinner-hhvncee1kg {
		width: 200px;
		height: 200px;
		display: inline-block;
		overflow: hidden;
		background: none;
	}
	.ldio-pvvi8rfsy39 {
		width: 100%;
		height: 100%;
		position: relative;
		transform: translateZ(0) scale(1);
		backface-visibility: hidden;
		transform-origin: 0 0; /* see note above */
	}
	.ldio-pvvi8rfsy39 div {
		box-sizing: content-box;
	}
	/* generated by https://loading.io/ */
</style>
