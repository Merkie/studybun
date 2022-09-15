<script lang="ts">
	import type { ISet } from '$lib/types';
	import type { Session } from 'lucia-sveltekit/types';
	import { ArrowLeft, ArrowRight, ArrowsExpand, Icon } from 'svelte-hero-icons';

	export let context: string;
	export let maximizedCallback: Function;
	export let session: Session;

	// bindings
	let userMessage = ''; // binded to the user message input text box
	let messageBox: HTMLDivElement; // binded to the message box div

	let maximized = false;

	let messages: Array<{ bot: boolean; message: string }> = [];

	const fetch_response_from_api = async () => {
		const response = await fetch('/api/ai/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				context,
				messages,
				session
			})
		});

		const data = await response.json();
		if (data.response) {
			messages.push({ bot: true, message: data.response });
			messages = [...messages];
			messageBox.scroll({ top: messageBox.scrollHeight, behavior: 'smooth' });
		}
	};

	const sendMessage = async () => {
		if (userMessage) {
			messages.push({ bot: false, message: userMessage });
			messages = [...messages];
			userMessage = '';
			messageBox.scroll({ top: messageBox.scrollHeight, behavior: 'smooth' });
		}
		await fetch_response_from_api();
	};

	$: {
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

	<div bind:this={messageBox} class="chat-display">
		{#each messages as item}
			<div class={item.bot ? 'bot-msg' : 'user-msg'}>{item.message}</div>
		{/each}
	</div>

	<div class="inputgroup">
		<input bind:value={userMessage} type="text" placeholder="Ask a question..." />
		<button on:click={sendMessage}>Send</button>
	</div>
</main>

<style>
	main {
		background-color: var(--container-background);
		padding: 50px;
		border-radius: 5px;
		position: relative;
		overflow-x: hidden;
		min-height: 350px;
		/* height: 400px; */
	}

	.user-msg,
	.bot-msg {
		background-color: var(--surface-background);
		border: 1px solid var(--border);
		padding: 10px;
		border-radius: 5px;
		margin: 10px 0;
		width: fit-content;
		font-size: 1.2rem;
		margin-bottom: 50px;
	}

	.bot-msg {
		background-color: var(--highlight);
	}

	.user-msg {
		margin-left: auto;
	}

	.chat-display {
		position: absolute;
		width: calc(100% - 100px);
		overflow-y: scroll;
		max-height: 275px;
		scrollbar-width: 5px;
		bottom: 125px;
		overflow-anchor: none;
	}

	.maximized .chat-display {
		max-height: 100%;
		width: calc(100% - 20px);
	}

	.maximized .inputgroup {
		width: calc(100% - 20px);
	}

	.inputgroup {
		display: flex;
		position: absolute;
		width: calc(100% - 100px);
		bottom: 50px;
		height: 50px;
		gap: 25px;
	}

	.inputgroup input {
		flex: 1;
		padding: 10px;
		border-radius: 10px;
	}

	.inputgroup button {
		width: 100px;
		background-color: var(--surface-background);
		color: var(--text-color);
		border: 1px solid var(--border);
		border-radius: 10px;
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

	.maximized {
		position: absolute;
		top: 0;
		left: 0;
		width: calc(100% - 20px);
		height: calc(100vh - 155px);
		padding: 10px;
	}

	@media (max-width: 600px) {
		.navigation button {
			padding: 20px 20px;
			width: 100px;
		}
	}
</style>
