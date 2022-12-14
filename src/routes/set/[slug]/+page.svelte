<script lang="ts">
	import type { ISet, IUser } from '$lib/types';
	import FlashcardDisplay from '$lib/components/FlashcardDisplay.svelte';
	import FreeresponseDisplay from '$lib/components/FreeresponseDisplay.svelte';
	import { Bookmark, Chat, Icon, Pencil, Refresh, ClipboardCopy } from 'svelte-hero-icons';
	import { getSession } from 'lucia-sveltekit/client';
	import type { Session } from 'lucia-sveltekit/types';
	import { toggle_favorite } from '$lib/api/client';
	import DiscussDisplay from '$lib/components/DiscussDisplay.svelte';
	export let data: { user: IUser; url: string; set: ISet; isFavorited: boolean };
	let selected = 'flashcards';

	let favorited = data.isFavorited;
	let sess: Session;
	let maximized = false;

	getSession().subscribe((s) => {
		sess = s;
	});

	const favorite_set = () => {
		favorited = !favorited;
		toggle_favorite(data.set.id, sess, favorited);
	};

	const maximizedCallback = (max: boolean) => {
		maximized = max;
	};
</script>

<svelte:head>
	<title>{data.set.name} Flashcards | Study Bun</title>
	<meta property="og:image" content="https://studybun.com/favicon.png" />
	<meta property="og:title" content="{data.set.name} Flashcards | Study Bun" />
	<meta name="title" content="{data.set.name} Flashcards | Study Bun" />
	<meta
		name="description"
		content={'Terms in this set: ' +
			data.set.flashcards
				.slice(0, 5)
				.map((e) => {
					return e.term;
				})
				.join(', ') +
			'...'}
	/>
	<meta
		property="og:description"
		content={'Terms in this set: ' +
			data.set.flashcards
				.slice(0, 5)
				.map((e) => {
					return e.term;
				})
				.join(', ') +
			'...'}
	/>
</svelte:head>

<h1 style="margin-bottom: 5px; display: flex; align-items: center; gap: 10px;">
	{data.set.name}
	{#if data.user}
		{#if data.user.id === data.set.author.id}
			<a href={'/create?set=' + data.set.id}>
				<Icon src={Pencil} width="25px" />
			</a>
		{/if}
	{/if}
</h1>

<span class="option-buttons">
	<button
		class={`${selected === 'flashcards' ? 'selected' : ''}`}
		on:click={() => (selected = 'flashcards')}
		><svg
			xmlns="http://www.w3.org/2000/svg"
			x="0px"
			y="0px"
			width="15"
			height="15"
			viewBox="0 0 481.308 481.308"
			style=" fill:var(--text-color)"
			><path
				d="M 246.93164 0.001953125 C 228.22141 -0.23174832 217.99341 12.409484 212.67188 23.181641 C 209.70187 29.194641 214.96934 35.968453 221.52734 34.564453 C 250.51634 28.360453 280.3085 46.055234 287.8125 75.990234 L 363.8418 379.02148 C 367.4618 393.49048 365.16127 407.92458 358.57227 419.89258 C 355.60627 425.28158 359.61567 431.9087 365.76367 431.7207 C 382.75867 431.2017 398.90147 419.44664 403.48047 401.18164 C 486.29047 70.856641 480.61133 95.987078 480.61133 88.830078 C 480.61133 70.761078 468.37127 54.281687 450.07227 49.679688 L 258.22266 1.5507812 C 254.15344 0.53078125 250.3965 0.045231171 246.93164 0.001953125 z M 233.44922 49.339844 C 230.11725 49.31931 226.72742 49.713594 223.3418 50.5625 L 31.150391 98.78125 C 9.5703906 104.20125 -3.5799219 126.15242 1.8300781 147.73242 L 77.861328 450.77148 C 83.245328 472.23548 105.07755 485.5238 126.81055 480.0918 L 319.01172 431.87109 C 340.54172 426.47309 353.75231 404.64988 348.32031 382.92188 L 272.29102 79.882812 C 267.72548 61.671312 251.44187 49.450728 233.44922 49.339844 z M 163.36523 196.66797 C 168.79853 196.75379 174.27028 199.01205 178.34766 203.81055 L 193.68359 221.86133 C 194.58559 222.92233 195.95389 223.47903 197.33789 223.33203 L 220.90234 220.93164 C 237.65434 219.24464 248.93978 237.45383 240.17578 251.67383 L 227.74609 271.83789 C 227.01609 273.02389 226.91456 274.49258 227.47656 275.76758 L 237.04297 297.43555 C 243.81197 312.77155 230.04777 329.21763 213.75977 325.26562 L 190.74219 319.67773 C 189.38819 319.34873 187.96083 319.70577 186.92383 320.63477 L 169.26953 336.42773 C 156.78153 347.59873 136.87942 339.60377 135.60742 322.88477 L 133.81055 299.26758 C 133.70555 297.87858 132.92275 296.63069 131.71875 295.92969 L 111.24219 284.02148 C 96.751188 275.59448 98.222703 254.19727 113.7207 247.82227 L 135.62891 238.81445 C 136.91791 238.28445 137.8603 237.15497 138.1543 235.79297 L 143.1543 212.64062 C 145.3618 202.4175 154.30974 196.52493 163.36523 196.66797 z M 163.0293 212.67188 C 161.13646 212.63202 159.26047 213.85133 158.79297 216.01758 L 153.79492 239.16992 C 152.38892 245.68092 147.87094 251.07933 141.71094 253.61133 L 119.80469 262.61914 C 116.55469 263.95614 116.24716 268.42345 119.28516 270.18945 L 139.76172 282.09961 C 145.51872 285.44861 149.25672 291.41178 149.76172 298.05078 L 151.55859 321.66992 C 151.82559 325.17292 155.97861 326.84595 158.59961 324.50195 L 176.25391 308.71094 C 181.21591 304.26994 188.04163 302.55595 194.51562 304.12695 L 217.5332 309.7168 C 220.9532 310.5448 223.8223 307.10748 222.4043 303.89648 L 212.83984 282.22656 C 210.15084 276.13356 210.631 269.11141 214.125 263.44141 L 226.55469 243.27734 C 228.40269 240.28134 226.01144 236.49561 222.52344 236.84961 L 198.95703 239.24805 C 192.33303 239.91505 185.80323 237.2977 181.49023 232.2207 L 166.1543 214.16992 C 165.30717 213.1728 164.165 212.69579 163.0293 212.67188 z"
			/></svg
		> Flashcards</button
	>
	<button
		on:click={() => (selected = 'freeresponse')}
		class={`${selected === 'freeresponse' ? 'selected' : ''}`}
		><Icon width="15px" src={Pencil} /> Free Response</button
	>
	<button
		on:click={() => (selected = 'discuss')}
		class={`${selected === 'discuss' ? 'selected' : ''}`}
		><Icon width="15px" src={Chat} /> Discuss</button
	>
	<button
		disabled={true}
		class={`${selected === 'match' ? 'selected' : ''}`}
		on:click={() => (selected = 'match')}
		><svg
			xmlns="http://www.w3.org/2000/svg"
			x="0px"
			y="0px"
			width="15px"
			height="15px"
			viewBox="0 0 50 50"
			style=" fill:var(--text-color);"
		>
			<path
				d="M45.986,23.903c-0.007-0.069-0.015-0.138-0.036-0.203c-0.003-0.008-0.002-0.016-0.004-0.024 c-0.01-0.029-0.029-0.051-0.042-0.079c-0.025-0.056-0.051-0.11-0.085-0.161c-0.024-0.034-0.051-0.064-0.079-0.095 c-0.037-0.042-0.076-0.082-0.12-0.117c-0.033-0.027-0.068-0.049-0.105-0.071c-0.026-0.016-0.048-0.038-0.076-0.051 c-0.024-0.011-0.049-0.014-0.073-0.024c-0.04-0.016-0.079-0.028-0.121-0.039c-0.057-0.015-0.114-0.023-0.172-0.027 C45.048,23.01,45.025,23,45,23h-3.838l4.478-3.732C45.868,19.078,46,18.797,46,18.5v-2.438v-0.437V14v-3.758V1 c0-0.003-0.001-0.005-0.001-0.007c0-0.03-0.01-0.06-0.013-0.09c-0.007-0.069-0.015-0.138-0.036-0.203 c-0.003-0.008-0.002-0.016-0.004-0.024c-0.01-0.029-0.029-0.051-0.042-0.079c-0.025-0.056-0.051-0.11-0.085-0.161 c-0.024-0.034-0.051-0.064-0.079-0.095c-0.037-0.042-0.076-0.082-0.12-0.117c-0.033-0.027-0.068-0.049-0.105-0.071 c-0.026-0.016-0.048-0.038-0.076-0.051c-0.023-0.011-0.049-0.014-0.073-0.023c-0.04-0.016-0.08-0.029-0.123-0.04 c-0.056-0.014-0.111-0.022-0.167-0.026C45.051,0.01,45.027,0,45,0H19c-0.205,0-0.405,0.063-0.573,0.181l-10,7 c-0.029,0.02-0.048,0.049-0.074,0.072c-0.034,0.03-0.065,0.059-0.095,0.093C8.204,7.406,8.162,7.471,8.125,7.542 C8.107,7.576,8.086,7.606,8.072,7.642c-0.043,0.112-0.07,0.23-0.071,0.352C8.001,7.996,8,7.998,8,8v18c0,0.552,0.447,1,1,1h3.97 l-4.544,3.181c-0.024,0.017-0.036,0.043-0.058,0.061c-0.054,0.045-0.098,0.094-0.141,0.148c-0.039,0.05-0.075,0.098-0.104,0.154 c-0.029,0.055-0.048,0.112-0.067,0.173c-0.02,0.067-0.035,0.131-0.04,0.2C8.014,30.946,8,30.971,8,31v17.242V49 c0,0.208,0.079,0.391,0.187,0.551c0.036,0.052,0.061,0.112,0.106,0.157c0.028,0.028,0.068,0.043,0.1,0.067 c0.069,0.054,0.136,0.112,0.218,0.147C8.73,49.972,8.862,50,9,50h27c0.124,0,0.247-0.028,0.363-0.073 c0.044-0.017,0.08-0.046,0.121-0.069c0.052-0.03,0.109-0.05,0.156-0.089l9-7.5C45.868,42.078,46,41.797,46,41.5V24 c0-0.003-0.001-0.005-0.001-0.007C45.999,23.963,45.989,23.933,45.986,23.903z M19.315,2h22.769l-6.429,5H12.172L19.315,2z M10,9h25 v12.242v1.379V23v2h-1h-1.758H32h-0.758H10V9z M29.242,27H32h0.242H34h2c0,0,0,0,0,0s0,0,0,0c0.123,0,0.244-0.027,0.361-0.073 c0.045-0.018,0.082-0.047,0.123-0.07c0.052-0.029,0.107-0.049,0.155-0.088L38.762,25h3.323l-6.429,5H30h-1.758H28h-1.758h-14.07 l4.286-3H29.242z M10,32h14.242H28h0.242H30h5v16H10v-1.758V32z"
			/></svg
		> Match</button
	>
	<button
		disabled={true}
		class={`${selected === 'test' ? 'selected' : ''}`}
		on:click={() => (selected = 'test')}
		><svg
			xmlns="http://www.w3.org/2000/svg"
			x="0px"
			y="0px"
			width="15px"
			height="15px"
			viewBox="0 0 50 50"
			style=" fill:var(--text-color);"
			><path
				d="M 7 7 C 5.3550302 7 4 8.3550302 4 10 L 4 40 C 4 41.64497 5.3550302 43 7 43 L 43 43 C 44.64497 43 46 41.64497 46 40 L 46 10 C 46 8.3550302 44.64497 7 43 7 L 7 7 z M 7 9 L 43 9 C 43.56503 9 44 9.4349698 44 10 L 44 13 L 6 13 L 6 10 C 6 9.4349698 6.4349698 9 7 9 z M 8 10 A 1 1 0 0 0 7 11 A 1 1 0 0 0 8 12 A 1 1 0 0 0 9 11 A 1 1 0 0 0 8 10 z M 11 10 A 1 1 0 0 0 10 11 A 1 1 0 0 0 11 12 A 1 1 0 0 0 12 11 A 1 1 0 0 0 11 10 z M 14 10 A 1 1 0 0 0 13 11 A 1 1 0 0 0 14 12 A 1 1 0 0 0 15 11 A 1 1 0 0 0 14 10 z M 6 15 L 44 15 L 44 40 C 44 40.56503 43.56503 41 43 41 L 7 41 C 6.4349698 41 6 40.56503 6 40 L 6 15 z M 36.980469 18.988281 A 1.0001 1.0001 0 0 0 36.167969 19.445312 L 32.84375 24.429688 L 30.707031 22.292969 A 1.0001 1.0001 0 0 0 29.990234 21.990234 A 1.0001 1.0001 0 0 0 29.292969 23.707031 L 32.175781 26.589844 A 1.0001 1.0001 0 0 0 32.884766 27.005859 A 1.0001 1.0001 0 0 0 32.908203 27.009766 A 1.0001 1.0001 0 0 0 33.007812 27.013672 A 1.0001 1.0001 0 0 0 33.017578 27.013672 A 1.0001 1.0001 0 0 0 33.027344 27.013672 A 1.0001 1.0001 0 0 0 33.945312 26.382812 L 37.832031 20.554688 A 1.0001 1.0001 0 0 0 36.980469 18.988281 z M 13 22 A 1.0001 1.0001 0 1 0 13 24 L 24 24 A 1.0001 1.0001 0 1 0 24 22 L 13 22 z M 36.980469 28.988281 A 1.0001 1.0001 0 0 0 36.167969 29.445312 L 32.84375 34.429688 L 30.707031 32.292969 A 1.0001 1.0001 0 0 0 29.990234 31.990234 A 1.0001 1.0001 0 0 0 29.292969 33.707031 L 32.175781 36.589844 A 1.0001 1.0001 0 0 0 32.884766 37.005859 A 1.0001 1.0001 0 0 0 32.908203 37.009766 A 1.0001 1.0001 0 0 0 33.007812 37.013672 A 1.0001 1.0001 0 0 0 33.017578 37.013672 A 1.0001 1.0001 0 0 0 33.027344 37.013672 A 1.0001 1.0001 0 0 0 33.945312 36.382812 L 37.832031 30.554688 A 1.0001 1.0001 0 0 0 36.980469 28.988281 z M 13 32 A 1.0001 1.0001 0 1 0 13 34 L 24 34 A 1.0001 1.0001 0 1 0 24 32 L 13 32 z"
			/></svg
		>
		Test</button
	>
</span>

{#if selected == 'flashcards'}
	<FlashcardDisplay {maximizedCallback} set={data.set} />
{/if}

{#if selected == 'freeresponse'}
	<FreeresponseDisplay {maximizedCallback} set={data.set} />
{/if}

{#if selected == 'discuss'}
	<DiscussDisplay session={sess} {maximizedCallback} context={data.set.name} />
{/if}

{#if !maximized}
	<span class="info-section">
		<small>Created by</small>
		<span style="display: flex; align-items: center; justify-content: space-between;">
			<h3 style=" display: flex; align-items: center; gap: 5px;">
				<img src={data.set.author.image} width="25px" alt="profile" style="border-radius: 50%;" /><a
					style="color: var(--highlight"
					href={`/profile/${data.set.author.id}`}>{data.set.author.name}</a
				>
			</h3>
			<span class="action-btns" style="display: flex; gap: 10px;">
				{#if data.user}
					<button on:click={favorite_set}>
						<Icon solid={favorited} width="20px" src={Bookmark} />
					</button>
				{/if}
				<button on:click={() => navigator.clipboard.writeText(window.location)}>
					<div class="tooltip">Copied!</div>
					<Icon width="20px" src={ClipboardCopy} />
				</button>
			</span>
		</span>
		<p style="margin-top: 0;">
			{data.set.description}
		</p>

		<h1>Terms in this set:</h1>

		{#each data.set.flashcards as card}
			<span class="term-card">
				<span class="term-card-header">
					<p style="font-size: 1.6rem; font-weight: bold;">{card.term}</p>
					{#if card.image}
						<img src={card.image} width="100px;" alt="" />
					{/if}
				</span>
				<span>
					<p>{card.description}</p>
				</span>
			</span>
		{/each}
	</span>
{/if}

<style>
	.tooltip {
		position: absolute;
		top: -40px;
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--highlight);
		color: var(--background);
		padding: 5px;
		border-radius: 5px;
		font-size: 0.8rem;
	}

	.term-card {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 10px;
		background-color: var(--container-background);

		font-size: 1.2rem;
		padding: 30px;
		border-radius: 10px;
		margin-bottom: 30px;
	}

	.term-card img {
		border-radius: 10px;
	}
	.term-card span {
		flex: 1;
	}

	.term-card p {
		white-space: pre-wrap;
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

	.selected {
		background-color: var(--container-background) !important;
		transform: scale(1.05);
		filter: brightness(1.1);
	}

	.option-buttons button:hover {
		transform: scale(1.05);
		filter: brightness(1.1);
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
		position: relative;
	}
	.action-btns button:hover {
		transform: scale(1.05);
		filter: brightness(1.1);
	}

	.action-btns button:active {
		background-color: var(--text-color);
		color: var(--surface-background);
	}

	@media (max-width: 850px) {
		h1 {
			font-size: 1.5rem;
		}

		.term-card {
			flex-direction: column;
		}

		.term-card-header {
			display: flex;
			justify-content: space-between;
		}
	}

	@media (max-width: 500px) {
		h1 {
			font-size: 1rem;
		}
	}
</style>
