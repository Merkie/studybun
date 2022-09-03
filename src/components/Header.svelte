<script lang="ts">
	// Props
	export let discordLoginUrl: string;
	export let user: IUser;

	import { Icon, Search, Plus } from 'svelte-hero-icons';
	import { signOut } from 'lucia-sveltekit/client';
	import type { IUser } from '$lib/types';
	import { theme } from '$lib/stores';

	let dropdownShowing = false;
	let themeSelect: HTMLSelectElement;
	let searchInput: HTMLInputElement;
</script>

<main>
	<nav>
		<img
			on:click={() => window.location.assign('/')}
			src="https://studybun.vercel.app/logo.png"
			width="30px"
			alt=""
		/>

		<span>
			{#if user}
				<a style="" class="create" href="/create"
					><Icon width="14px" src={Plus} /><span style="display: none;">Create</span></a
				>
			{/if}
			<div class="search">
				<Icon style="padding-left: 5px" width="15px" src={Search} />
				<input
					on:change={() => window.location.assign('/search?term=' + searchInput.value)}
					bind:this={searchInput}
					type="text"
					placeholder="Search..."
				/>
			</div>
		</span>

		{#if user}
			<div style="position: relative;">
				<img
					on:click={() => (dropdownShowing = !dropdownShowing)}
					class="profile-image"
					src={user.image}
					width="40px"
					alt="profile"
				/>
				<div style={`display: ${dropdownShowing ? 'flex' : 'none'}`} class="drop-down">
					<p>{user.name}</p>
					<a href={'/profile/' + user.user_id}>Profile</a>
					<a href="/">Settings</a>
					<hr />
					<a href="/library">Library</a>
					<select bind:this={themeSelect} on:input={() => theme.set(themeSelect.value)}>
						<option value="light">Light</option>
						<option value="dark">Dark</option>
					</select>
					<button
						on:click={async () => {
							await signOut();
							window.location.assign('/');
						}}>Sign out</button
					>
				</div>
			</div>
		{:else}
			<button on:click={() => window.location.assign(discordLoginUrl)} class="discord"
				><img src="discord.svg" width="20x" alt="discord" />
				<span>Sign in with Discord</span></button
			>
		{/if}
	</nav>
</main>

<style>
	main {
		width: 100%;
		background-color: var(--surface-background);
		filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.2));
		position: absolute;
		top: 0;
		left: 0;
		z-index: 100;
	}
	nav {
		background-color: var(--surface-background);
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: sticky;
		top: 0;
		width: min(80%, 1200px);
		margin: auto;
		padding-bottom: 10px;
		padding-top: 10px;
	}

	hr {
		width: 100%;
		color: var(--border);
	}

	select {
		-webkit-appearance: none;
		background-color: var(--container-background);
		border: 1px solid var(--border);
		padding: 10px;
		border-radius: 5px;
		color: var(--text-color);
	}

	img {
		cursor: pointer;
	}

	.discord {
		background-color: #7289da;
		color: white;
		border: none;
		border-radius: 5px;
		padding: 5px 10px;
		border: 1px solid #5a6cad;
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 16px;
		cursor: pointer;
	}

	.profile-image {
		border-radius: 50%;
	}

	.drop-down {
		position: absolute;
		width: 150px;
		top: calc(100% + 10px);
		right: 0;
		background-color: var(--surface-background);
		border-radius: 5px;
		box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
		padding: 5px;
		border: 1px solid var(--border);
	}

	.drop-down a {
		border-radius: 5px;
		padding: 10px 10px;
		text-decoration: none;
		color: var(--border);
		cursor: pointer;
	}

	.drop-down a:hover {
		background-color: var(--container-background);
		color: var(--text-color);
	}

	.drop-down p {
		margin: 10px;
	}

	.drop-down button {
		background-color: rgb(255, 91, 91);
		border: 1px solid rgb(178, 61, 61);
		color: white;
		border-radius: 5px;
		padding: 5px 10px;
		margin-top: 10px;
		cursor: pointer;
	}

	.search {
		border: 1px solid var(--border);
		border-radius: 5px;
		width: 250px;
		background-color: var(--container-background);
		display: flex;
		align-items: center;
		padding: 0px;
	}

	input {
		height: 100%;
		padding: 5px;
		background-color: inherit;
		border: none;
		outline: none;
		color: var(--text-color);
	}

	span {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	span a {
		color: var(--border);
		text-decoration: none;
		transition-duration: 0.1s;
	}

	span a:hover {
		filter: brightness(1.2);
		transform: translateY(-2px);
	}

	.create {
		background-color: #77d084;
		color: white;
		border: none;
		border-radius: 5px;
		padding: 5px 10px;
		border: 1px solid #28522e62;
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 16px;
		cursor: pointer;
	}

	.create:hover {
		color: white;
	}

	@media (max-width: 780px) {
		span a {
			display: none;
		}

		.search {
			width: 150px;
		}

		input {
			width: 120px;
		}

		.create {
			font-size: 14px;
		}

		.discord span {
			display: none;
		}

		.discord {
			padding: 10px;
		}
	}
</style>
