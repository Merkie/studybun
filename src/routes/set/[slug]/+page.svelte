<script lang="ts">
	export let data;
	import Header from '../../../components/Header.svelte';
	import { ArrowLeft, ArrowRight, Icon } from 'svelte-hero-icons';

	let index = 0;
	let termSide = true;
	let flashcard: HTMLDivElement;

	const flip = async () => {
		flashcard.style.transform = 'rotateX(90deg)';
		await new Promise((resolve) => setTimeout(resolve, 220));
		termSide = !termSide;
		flashcard.style.transform = 'rotateX(0deg)';
	};

	const progressCard = async () => {
		flashcard.style.transform = 'translateX(200px)';
		flashcard.style.opacity = '0';

		await new Promise((resolve) => setTimeout(resolve, 220));

		index = index + 1;
		if (index >= data.set.flashcards.length) {
			index = 0;
		}
		termSide = true;

		flashcard.style.transform = 'translateX(-200px)';

		await new Promise((resolve) => setTimeout(resolve, 220));
		flashcard.style.opacity = '1';

		flashcard.style.transform = 'translateX(0px)';
	};

	const progressBackwards = async () => {
		flashcard.style.transform = 'translateX(-00px)';
		flashcard.style.opacity = '0';

		await new Promise((resolve) => setTimeout(resolve, 220));

		index = index - 1;
		if (index < 0) {
			index = data.set.flashcards.length - 1;
		}
		termSide = true;

		flashcard.style.transform = 'translateX(200px)';

		await new Promise((resolve) => setTimeout(resolve, 220));
		flashcard.style.opacity = '1';

		flashcard.style.transform = 'translateX(0px)';
	};
</script>

<Header discordLoginUrl={data.url} user={data.user} />

<div
	class="progressbar"
	style={'width: calc(100vw * ' + (index + 1) / data.set.flashcards.length + ');'}
/>

<main>
	<div class="set-info">
		<h4>
			{data.set.name}:
			<span style="font-weight: normal;">
				By <a href={`/profile/${data.set.author.id}`}>{data.set.author.name}</a></span
			>
		</h4>
		<h4 />
	</div>

	<div on:click={flip} class="flashcard" bind:this={flashcard}>
		<h4 class="card-header">{index + 1} / {data.set.flashcards.length}</h4>
		<span
			><p>{termSide ? 'Term' : 'Definition'}</p>
			<h1 class={termSide ? 'term' : 'def'} style="text-align: center;">
				{data.set.flashcards[index][termSide ? 'term' : 'description']}
			</h1>

			<!-- <p>{data.set.flashcards[index].description}</p> -->
		</span>
	</div>

	<div class="navigation">
		<button on:click={progressBackwards}><Icon src={ArrowLeft} width="20px" /></button>
		<button on:click={progressCard}><Icon src={ArrowRight} width="20px" /></button>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 50px;
		margin-top: 50px;
		overflow-x: hidden;
		margin-top: 100px;
		padding-bottom: 100px;
	}
	.flashcard {
		width: min(80%, 500px);
		background-color: #fff;
		padding: 30px;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		transition-duration: 0.2s;
		color: black;
		position: relative;
		white-space: pre-wrap;
	}

	.term {
		font-size: 2.5rem;
	}

	.def {
		font-size: 24px !important;
		text-align: left !important;
		font-weight: normal;
	}

	.set-info {
		background-color: var(--container-background);
		border: 1px solid var(--border);
		padding: 10px 20px;
		border-radius: 10px;
	}

	.set-info * {
		margin: 0;
	}

	.progressbar {
		height: 5px;
		background-color: var(--container-background);
		transition-duration: 0.2s;
	}

	.navigation button {
		background-color: var(--container-background);
		border: 1px solid var(--border);
		padding: 10px 20px;
		border-radius: 5px;
		transition-duration: 0.2s;
		cursor: pointer;
		font-size: 20px;
		color: var(--text-color);
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
</style>
