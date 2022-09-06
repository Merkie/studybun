<script lang="ts">
	import type { IUser } from '$lib/types';
	import { format } from 'timeago.js';
	import SetDisplayCard from '../../../components/SetDisplayCard.svelte';
	export let data: { user: IUser; slugUser: IUser; url: string };
</script>

<div class="header">
	<img src={data.slugUser.image} width="100px" alt="" />
	<h1>
		{data.slugUser.name}
		<small>Joined {format(data.slugUser.created_at)}</small>

		{#if data.slugUser.account_plan == 'premium'}
			<small on:click={() => window.location.assign('/premium')} class="sb-plus"
				>Study Bun Plus</small
			>
		{/if}
		{#if data.user.user_id == data.slugUser.id}
			<small style="margin-top: 10px;">Used tokens: {data.slugUser.used_openai_tokens}</small>
			<small style="margin-top: 10px;"
				>Used tokens ($): {((0.02 / 1000) * data.slugUser.used_openai_tokens).toFixed(3)}</small
			>
		{/if}
	</h1>
</div>

<h1>{data.slugUser.name}'s study sets</h1>
<span style="display: flex; flex-wrap: wrap; gap: 30px;">
	{#each data.slugUser.FlashcardSet as item}
		<SetDisplayCard set={item} />
	{/each}
</span>

<style>
	.header {
		display: flex;
		align-items: center;
		gap: 20px;
		padding-bottom: 30px;
		margin-bottom: 30px;
		border-bottom: 1px solid var(--border);
	}

	.header h1 {
		display: flex;
		flex-direction: column;
	}

	small {
		font-weight: normal;
		font-size: 0.5em;
		margin-top: 5px;
	}

	img {
		border-radius: 50%;
	}

	.sb-plus {
		background-color: rgb(29, 82, 241);
		border: 1px solid rgb(54, 172, 227);
		padding: 5px 10px;
		border-radius: 5px;
		width: fit-content;
		color: white;
		cursor: pointer;
		transition-duration: 0.1s;
	}

	.sb-plus:hover {
		transform: scale(1.05);
		filter: brightness(1.1);
	}
</style>
