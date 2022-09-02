<script lang="ts">
	export let data;
	import Header from '../../../components/Header.svelte';

	let index = 0;
	let termSide = true;
	let flashcard: HTMLDivElement;

	const progressCard = async () => {
		flashcard.style.transform = 'translate(-50%, -50%) rotateX(90deg)';
		await new Promise((resolve) => setTimeout(resolve, 220));
		if (termSide) {
			termSide = false;
		} else {
			termSide = true;
			index = index + 1;
		}

		if (index >= data.set.flashcards.length) index = 0;
		flashcard.style.transform = 'translate(-50%, -50%) rotateX(0deg)';

		$: console.log(index);
	};
</script>

<Header discordLoginUrl={data.url} user={data.user} />

<div on:click={progressCard} class="flashcard" bind:this={flashcard}>
	<span
		><h1>{termSide ? 'Term' : 'Definition'}</h1>

		<h3>
			{data.set.name}
			<small style="font-weight: normal">{index + 1}/{data.set.flashcards.length}</small>
		</h3>
		<p>{data.set.flashcards[index][termSide ? 'term' : 'description']}</p>
		<!-- <p>{data.set.flashcards[index].description}</p> -->
	</span>
</div>

<style>
	.flashcard {
		width: min(80%, 500px);
		background-color: #fff;
		padding: 30px;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		position: absolute;
		top: 300px;
		left: 50%;
		transform: translate(-50%, -50%);
		transition-duration: 0.2s;
	}
</style>
