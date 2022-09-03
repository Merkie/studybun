<script lang="ts">
	export let data;
	import Header from '../../../components/Header.svelte';

	let index = 0;
	let termSide = true;
	let flashcard: HTMLDivElement;

	const flip = async () => {
		flashcard.style.transform = 'translate(-50%, -50%) rotateX(90deg)';
		await new Promise((resolve) => setTimeout(resolve, 220));
		termSide = !termSide;
		flashcard.style.transform = 'translate(-50%, -50%) rotateX(0deg)';
	};

	const progressCard = async () => {
		flashcard.style.transform = 'translate(-50%, -50%) translateX(200px)';
		flashcard.style.opacity = '0';

		await new Promise((resolve) => setTimeout(resolve, 220));

		index = index + 1;
		if (index >= data.set.flashcards.length) {
			index = 0;
		}

		flashcard.style.transform = 'translate(-50%, -50%) translateX(-200px)';

		await new Promise((resolve) => setTimeout(resolve, 220));
		flashcard.style.opacity = '1';

		flashcard.style.transform = 'translate(-50%, -50%) translateX(0px)';
	};
</script>

<Header discordLoginUrl={data.url} user={data.user} />

<div
	class="progressbar"
	style={'width: calc(100vw * ' + (index + 1) / data.set.flashcards.length + ');'}
/>

<div class="set-info">
	<h4>{data.set.name}</h4>
	<h4>By <a href={`/profile/${data.set.author.id}`}>{data.set.author.name}</a></h4>
	<h4>Term: {index + 1}/{data.set.flashcards.length}</h4>
</div>

<div on:click={flip} class="flashcard" bind:this={flashcard}>
	<span
		><h1>{termSide ? 'Term' : 'Definition'}</h1>

		<h3>
			<small style="font-weight: normal">{index + 1}/{data.set.flashcards.length}</small>
		</h3>
		<p>{data.set.flashcards[index][termSide ? 'term' : 'description']}</p>

		<!-- <p>{data.set.flashcards[index].description}</p> -->
	</span>
</div>

<div class="navigation">
	<button on:click={progressCard}>Back</button>
	<button on:click={progressCard}>Next</button>
</div>

<style>
	.flashcard {
		width: min(80%, 500px);
		background-color: #fff;
		padding: 30px;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		position: absolute;
		top: 380px;
		left: 50%;
		transform: translate(-50%, -50%);
		transition-duration: 0.2s;
		color: black;
	}

	.set-info {
		position: absolute;
		top: 165px;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: var(--container-background);
		border: 1px solid var(--border);
		padding: 0 30px;
		border-radius: 10px;
		width: min(70%, 500px);
	}

	.progressbar {
		height: 5px;
		background-color: var(--container-background);
		position: absolute;
		transition-duration: 0.2s;
	}

	.navigation {
		position: absolute;
		top: 550px;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
