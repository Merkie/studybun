<script lang="ts">
	// Props
	export let discordLoginUrl: string;
	export let user: IUser;

	import { Icon, Search, Plus } from 'svelte-hero-icons';
	import { signOut } from 'lucia-sveltekit/client';
	import type { IUser } from '$lib/types';

	let dropdownShowing = false;
</script>

<nav>
	<img on:click={() => window.location.assign('/')} src="logo.png" width="30px" alt="" />

	<span>
		<a href="/">Home</a>
		<a href="/">Explore</a>
		{#if user}
			<a href="/library">Your Library</a>
			<a class="create" href="/create"><Icon width="15px" src={Plus} /><span>Create</span></a>
		{/if}
		<div class="search">
			<Icon width="15px" src={Search} />
			<input type="text" placeholder="Search..." />
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
				<a href="/">Profile</a>
				<a href="/">Settings</a>
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
			><img src="discord.svg" width="20x" alt="discord" /> <span>Sign in with Discord</span></button
		>
	{/if}
</nav>

<style>
	nav {
		padding: 10px 50px;
		background-color: var(--surface-background);
		display: flex;
		justify-content: space-between;
		align-items: center;
		filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.2));
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
		z-index: 999;
	}

	.drop-down a {
		border-radius: 5px;
		padding: 10px 10px;
		text-decoration: none;
		color: rgb(107, 66, 100);
		cursor: pointer;
	}

	.drop-down a:hover {
		background-color: #ffecfc;
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
		margin-top: 20px;
		cursor: pointer;
	}

	.search {
		border: 1px solid #56274e59;
		border-radius: 5px;
		width: 250px;
		margin-left: 10px;
		background-color: var(--light-pink);
		display: flex;
		align-items: center;
		padding: 5px;
	}

	input {
		height: 100%;
		padding: 5px;
		background-color: inherit;
		border: none;
		outline: none;
	}

	span {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	span a {
		color: #56274e;
		text-decoration: none;
		transition-duration: 0.1s;
	}

	span a:hover {
		color: #924385;
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

		nav {
			padding: 10px 15px;
		}
	}
</style>
