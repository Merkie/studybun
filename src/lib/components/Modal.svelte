<script lang="ts">
	export let message: string;
	export let options: { [key: string]: Function };
	export let close: Function;
</script>

<main>
	<div>
		<h3>{message}</h3>
		{#each Object.keys(options) as key}
			<button class="color-btn" on:click={() => options[key]()}>{key}</button>
		{/each}
		<button on:click={() => close()}>Cancel</button>
	</div>
</main>

<style>
	main {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 999;
	}

	div {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: var(--surface-background);
		padding: 20px;
		border-radius: 10px;
	}

	button {
		background-color: var(--container-background);

		border: 1px solid var(--border);
		color: var(--text-color);
		padding: 10px 20px;
		border-radius: 5px;
		cursor: pointer;
		margin: 10px 0;
		font-size: 20px;
	}

	.color-btn {
		background-color: var(--failure-light);
		border-color: var(--failure-dark);
	}
</style>
