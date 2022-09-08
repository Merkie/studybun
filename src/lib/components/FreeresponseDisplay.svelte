<script lang="ts">
	import type { ISet, IUser } from '$lib/types';
	import { ArrowsExpand, Icon } from 'svelte-hero-icons';
	import { onMount } from 'svelte';
	import { check_free_response } from '$lib/api/client';

	export let set: ISet;
	export let user: IUser;

	let index = 0;
	let termSide = true;
	let responseText: string;
	let maximized = false;
	let question: HTMLDivElement;
	let answer: HTMLDivElement;
	let feedback = false;
	let showEndScreen = false;

	let responses = [];

	onMount(() => {
		answer.style.display = 'none';
		answer.style.opacity = '0';
	});

	const progress = async () => {
		index += 1;
		answer.style.display = 'none';
		answer.style.opacity = '0';
		question.style.display = 'block';
		question.style.transform = 'translateX(-120%)';
		responseText = '';
		question.style.transitionDuration = '0.5s';
		question.style.opacity = '1';
		question.style.transform = 'translateX(0%)';
		if (index == set.flashcards.length) {
			showEndScreen = true;
		}
		// if (index === set.questions.length + 1) {
		// 	index = 0;
		// }
	};

	const submitResponse = async () => {
		question.style.transitionDuration = '0.5s';
		question.style.transform = 'translateX(120%)';
		question.style.opacity = '0';
		await new Promise((resolve) => setTimeout(resolve, 500));
		question.style.display = 'none';
		answer.style.display = 'block';
		question.style.transitionDuration = '0s';

		feedback = (await check_free_response(set.flashcards[index].term, responseText)).feedback;

		responses.push({
			term: set.flashcards[index].term,
			definition: set.flashcards[index].description,
			response: responseText,
			feedback: feedback
		});

		answer.style.display = 'block';
		answer.style.transitionDuration = '.5s';
		answer.style.opacity = '1';
	};
</script>

<span class={`flashcard-wrapper ${maximized ? 'maximized' : ''}`}>
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
		style={'width: calc(100% * ' + (index + 1) / (set.flashcards.length + 1) + ');'}
	/>
	{#if !showEndScreen}
		<div
			class="answer"
			style={'background-color: ' + (feedback ? '#27b927' : '#db2c2c')}
			bind:this={answer}
		>
			<h1>{feedback ? 'Correct!' : 'Incorrect'}</h1>
			<div class="answer-split">
				<span
					><h3>Your answer:</h3>
					<p>{responseText}</p></span
				>
				<span
					><h3>Card definition:</h3>
					<p>{set.flashcards[index].description}</p></span
				>
			</div>
			<button on:click={progress} class="next-btn">Next</button>
		</div>
		<div bind:this={question} class="question">
			<div class="question-text">
				<p>
					Write the definition for the term <span style="font-weight: bold;"
						>"{set.flashcards[index].term}"</span
					> in your own words:
				</p>
				<textarea bind:value={responseText} rows="5" />
				<button on:click={submitResponse} class="submit-btn">Submit</button>
			</div>
		</div>
	{:else}
		<span class="end-screen">
			<h1>Your results</h1>
			<div class="results">
				{#each responses as response}
					<div class="result">
						<div
							class="feedback"
							style={'background-color: ' + (response.feedback ? '#27b927' : '#db2c2c')}
						>
							{response.feedback ? 'Correct!' : 'Incorrect'}
						</div>
						<h3>{response.term}</h3>
						<div class="result-split">
							<span
								><h4>Your answer:</h4>
								<p>{response.response}</p></span
							>
							<span
								><h4>Card definition:</h4>
								<p>{response.definition}</p></span
							>
						</div>
					</div>
				{/each}
			</div></span
		>
	{/if}
</span>

<style>
	.answer {
		padding: 20px;
		border-radius: 10px;
		color: white;
	}

	.result {
		background-color: var(--background);
		border-radius: 10px;
		padding: 20px;
		margin-bottom: 20px;
		border: 1px solid var(--border);
	}

	.result .feedback {
		padding: 10px;
		border-radius: 10px;
		color: white;
	}

	.answer-split {
		width: 100%;
		display: flex;
	}

	.answer-split * {
		flex: 1;
	}

	.next-btn {
		padding: 10px;
		border: white 1px solid;
		border-radius: 10px;
		background: none;
		color: white;
		cursor: pointer;
		transition-duration: 0.2s;
	}

	.next-btn:hover {
		background: white;
		color: black;
	}

	textarea {
		width: 100%;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 12px 20px;
		box-sizing: border-box;
	}

	.submit-btn {
		background-color: #77d084;
		border: 1px solid #4e8957;
		color: white;
		padding: 12px 20px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		margin: 4px 2px;
		cursor: pointer;
		border-radius: 5px;
		margin-top: 10px;
	}

	.flashcard {
		max-width: 500px;
		margin: 0 auto;
		background-color: #fff;
		padding: 30px;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		transition-duration: 0.2s;
		color: black;
		position: relative;
		white-space: pre-wrap;
	}

	.flashcard-wrapper {
		background-color: var(--container-background);
		padding: 50px;
		padding-top: 80px;
		border-radius: 5px;
		position: relative;
		overflow-x: hidden;
		min-height: 350px;
	}

	.term {
		font-size: 2.5rem;
	}

	.def {
		font-size: 18px !important;
		text-align: left !important;
		font-weight: normal;
	}

	.progressbar {
		position: absolute;
		top: 0;
		left: 0;
		height: 10px;
		background-color: var(--border);
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
		background-color: var(--background);
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

	.maximized {
		position: absolute;
		top: 0;
		left: 0;
		width: calc(100% - 20px);
		height: calc(100vh - 155px);
		padding: 10px;
	}

	.maximized .question {
		margin-top: 50px;
	}

	.maximized .answer {
		margin-top: 50px;
	}
</style>
