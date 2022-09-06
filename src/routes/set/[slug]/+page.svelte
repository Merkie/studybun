<script lang="ts">
	import type { ISet, IUser } from '$lib/types';
	import {
		ArrowLeft,
		ArrowRight,
		ArrowsExpand,
		Bookmark,
		Icon,
		Pencil,
		Refresh,
		Share
	} from 'svelte-hero-icons';

	export let data: { user: IUser; url: string; set: ISet };

	let index = 0;
	let termSide = true;
	let flashcard: HTMLDivElement;
	let maximized = false;

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

{#if !maximized}
	<h1 style="margin-bottom: 5px;">{data.set.name}</h1>

	<span class="option-buttons">
		<button><Icon width="15px" src={Pencil} /> Flashcards</button>
		<button><Icon width="15px" src={Pencil} /> Match</button>
		<button><Icon width="15px" src={Pencil} /> Test</button>
		<button><Icon width="15px" src={Pencil} /> Free Response</button>
		<button><Icon width="15px" src={Pencil} /> Discuss</button>
	</span>
{/if}

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
		style={'width: calc(100% * ' + (index + 1) / data.set.flashcards.length + ');'}
	/>

	<div
		on:click={(e) => {
			// @ts-ignore
			if (e.target?.tagName == 'DIV' || e.target?.tagName == 'H1') {
				flip();
			}
		}}
		class="flashcard"
		bind:this={flashcard}
	>
		<h4 class="card-header">{index + 1} / {data.set.flashcards.length}</h4>
		<span
			><p>{termSide ? 'Term' : 'description'}</p>
			{#if data.set.flashcards[index].image}
				<img
					style="margin-left: 50%; transform: translateX(-50%);"
					width="120px"
					src={data.set.flashcards[index].image}
					alt="flashcard"
				/>
			{/if}
			<h1 class={termSide ? 'term' : 'def'} style="text-align: center;">
				{data.set.flashcards[index][termSide ? 'term' : 'description']}
			</h1>

			<!-- <p>{data.set.flashcards[index].description}</p> -->
		</span>
		<div class="navigation">
			<button on:click={progressBackwards}><Icon src={ArrowLeft} width="20px" /></button>
			<button on:click={progressCard}><Icon src={ArrowRight} width="20px" /></button>
		</div>
	</div>
</span>

{#if !maximized}
	<span class="info-section">
		<small style="opacity: .5;">Created by</small>
		<span style="display: flex; align-items: center; justify-content: space-between;">
			<h3 style=" display: flex; align-items: center; gap: 5px;">
				<img src={data.set.author.image} width="25px" alt="profile" style="border-radius: 50%;" /><a
					href={`/profile/${data.set.author.id}`}>{data.set.author.name}</a
				>
			</h3>
			<span class="action-btns" style="display: flex; gap: 10px;">
				<button>
					<Icon width="20px" src={Bookmark} />
				</button>
				<button>
					<Icon width="20px" src={Refresh} />
				</button>
				<button>
					<Icon width="20px" src={Share} />
				</button>
			</span>
		</span>
		<p style="margin-top: 0;">
			{data.set.description}
		</p>
	</span>
{/if}

<style>
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
		margin: 0 auto;
	}

	.flashcard-wrapper {
		background-color: var(--container-background);
		padding: 50px;
		border-radius: 5px;
		position: relative;
		overflow-x: hidden;
	}

	.term {
		font-size: 2.5rem;
	}

	.def {
		font-size: 24px !important;
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
		width: calc(100% - 100px);
		height: calc(100vh - 240px);
	}

	.maximized .flashcard {
		top: 70px;
	}

	@media (max-width: 850px) {
		h1 {
			font-size: 1.5rem;
		}
	}

	@media (max-width: 500px) {
		h1 {
			font-size: 1rem;
		}
	}
</style>
