<script lang="ts">
	import type { ISet } from '$lib/types';
	import { ArrowLeft, ArrowRight, ArrowsExpand, Icon } from 'svelte-hero-icons';

	export let set: ISet;
	export let maximizedCallback: Function;

	let index = 0;
	let termSide = true;
	let flashcard: HTMLDivElement;
	let maximized = false;
	let displayText = '';

	const flip = async () => {
		flashcard.style.transitionDuration = '.2s';
		flashcard.style.transform = 'rotateX(90deg)';
		await new Promise((resolve) => setTimeout(resolve, 200));
		termSide = !termSide;
		flashcard.style.transform = 'rotateX(0deg)';
	};

	const progressCard = async () => {
		flashcard.style.transitionDuration = '.1';
		flashcard.style.transform = 'translateX(50px) perspective(400px) rotateY(-10deg) scale(1.05)';
		flashcard.style.opacity = '0.75';

		await new Promise((resolve) => setTimeout(resolve, 100));

		index = index + 1;
		if (index >= set.flashcards.length) {
			index = 0;
		}
		termSide = true;

		flashcard.style.transform = 'translateX(-50px)';

		await new Promise((resolve) => setTimeout(resolve, 100));
		flashcard.style.opacity = '1';

		flashcard.style.transform = 'translateX(0px)';
	};

	const progressBackwards = async () => {
		flashcard.style.transitionDuration = '.1';
		flashcard.style.transform = 'translateX(-50px) perspective(400px) rotateY(10deg) scale(1.05)';
		flashcard.style.opacity = '0.75';

		await new Promise((resolve) => setTimeout(resolve, 100));

		index = index - 1;
		if (index < 0) {
			index = set.flashcards.length - 1;
		}
		termSide = true;

		flashcard.style.transform = 'translateX(50px)';

		await new Promise((resolve) => setTimeout(resolve, 100));
		flashcard.style.opacity = '1';

		flashcard.style.transform = 'translateX(0px)';
	};

	$: {
		displayText = set.flashcards[index][termSide ? 'term' : 'description'];
		maximizedCallback(maximized);
	}
</script>

<main class={`${maximized ? 'maximized' : ''}`}>
	<button on:click={() => (maximized = !maximized)} class="expand-btn">
		{#if maximized}
			<svg
				width="20px"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
				/>
			</svg>
		{:else}
			<Icon width="20px" src={ArrowsExpand} />
		{/if}
	</button>

	<div
		class="progressbar"
		style={'width: calc(100% * ' + (index + 1) / set.flashcards.length + ');'}
	/>

	<span class="flashcard-wrapper">
		<div
			on:click={(e) => {
				// @ts-ignore
				if (e.target?.tagName == 'DIV' || e.target?.tagName == 'H1' || e.target?.tagName == 'IMG') {
					flip();
				}
			}}
			class="flashcard"
			bind:this={flashcard}
		>
			<h4 class="card-header">{index + 1} / {set.flashcards.length}</h4>
			<span>
				{#if set.flashcards[index].image}
					<img
						style="margin-left: 50%; transform: translateX(-50%);"
						width="120px"
						src={set.flashcards[index].image}
						alt="flashcard"
					/>
				{/if}
				<h1 class={termSide ? 'term' : 'def'} style="text-align: center;">
					{displayText}
				</h1>
			</span>
			<div class="navigation">
				<button on:click={progressBackwards}><Icon src={ArrowLeft} width="20px" /></button>
				<button on:click={progressCard}><Icon src={ArrowRight} width="20px" /></button>
			</div>
		</div>
	</span>
</main>

<style>
	.maximized .flashcard-wrapper {
		top: 150px;
		transform: translateY(-30%);
	}

	.flashcard-wrapper {
		position: absolute;
		top: 50%;
		left: 5%;
		width: 90%;
		transform: translateY(-50%);
	}
	.flashcard {
		max-width: 500px;
		background-color: var(--flashcard-background);
		padding: 30px;
		border-radius: 10px;
		box-shadow: 0 0 10px var(--drop-shadow-color);
		transition-duration: 0.2s;
		color: black;
		position: relative;
		white-space: pre-wrap;
		margin: 0 auto;
	}

	main {
		background-color: var(--container-background);

		padding: 50px;
		border-radius: 5px;
		position: relative;
		overflow-x: hidden;
		min-height: 350px;
		/* height: 400px; */
	}

	.def {
		font-size: 18px !important;
		/* text-align: left !important; */
		font-weight: normal;
	}

	.progressbar {
		position: absolute;
		top: 0;
		left: 0;
		height: 10px;
		background-color: var(--highlight);
		border-radius: 10px;
		transition-duration: 0.2s;
	}

	.navigation {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translate(-50%, 50%);
	}

	.navigation button {
		background-color: var(--surface-background);
		border: 1px solid var(--border);
		padding: 20px 20px;
		border-radius: 5px;
		transition-duration: 0.2s;
		cursor: pointer;
		font-size: 20px;
		color: var(--text-color);
		width: 150px;
	}

	.navigation * {
		margin: 0;
	}

	.navigation button:hover {
		transform: scale(1.05);
		filter: brightness(1.1);
	}

	.card-header {
		position: absolute;
		background-color: var(--surface-background);
		border: 1px solid var(--border);
		padding: 10px;
		border-radius: 5px;
		top: -50px;
		left: 50%;
		transform: translateX(-50%);
		filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.1));
		color: var(--text-color);
	}

	.navigation {
		display: flex;
		gap: 20px;
	}

	.option-buttons {
		display: flex;
		gap: 10px;
		margin-bottom: 20px;
		flex-wrap: wrap;
	}

	.option-buttons button {
		background-color: var(--surface-background);
		border: 1px solid var(--border);
		padding: 10px 10px;
		border-radius: 5px;
		transition-duration: 0.2s;
		cursor: pointer;
		font-size: 16px;
		color: var(--text-color);
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.option-buttons button:hover {
		transform: scale(1.05);
		filter: brightness(1.1);
	}

	.expand-btn {
		position: absolute;
		top: 0px;
		right: 0px;
		background: none;
		border: none;
		padding: 30px 30px;
		cursor: pointer;
		color: var(--text-color);
	}

	.info-section {
		padding-top: 30px;
		margin-top: 30px;
		border-top: 1px solid var(--border);
	}

	.action-btns button {
		background-color: var(--surface-background);
		border: 1px solid var(--border);
		padding: 10px 10px;
		border-radius: 100%;
		cursor: pointer;
		color: var(--text-color);
		transition-duration: 0.2s;
	}

	.action-btns button:hover {
		transform: scale(1.05);
		filter: brightness(1.1);
	}

	.term {
		font-size: 190%;
	}

	.maximized {
		position: absolute;
		top: 0;
		left: 0;
		width: calc(100% - 20px);
		height: calc(100vh - 155px);
		padding: 10px;
	}

	.maximized .flashcard {
		top: 70px;
		max-width: 1000px;
	}

	@media (max-width: 600px) {
		.navigation button {
			padding: 20px 20px;
			width: 100px;
		}
	}
</style>
