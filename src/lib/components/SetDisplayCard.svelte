<script lang="ts">
	import { format } from 'timeago.js';
	import { Bookmark, Eye, Icon, Pencil, Trash } from 'svelte-hero-icons';
	import type { ISet } from '$lib/types';
	export let set: ISet;
	// TODO: make these props better
	export let edit: boolean = false;
	export let index: number = 0;
	export let promptDelete: Function = () => {};
	export let indexCallback: Function = () => {};
	export let saved: string[] = [];

	const indexToBrightness = () => {
		const firstNumber = parseInt(index / 10 + '') + 1;
		if (firstNumber % 2 == 0) {
			return (9 - (index % 10)) / 10;
		}
		return ((index % 10) + 1) / 10;
	};
</script>

<div class="main" style={`filter: hue-rotate(${indexToBrightness() * 50}deg)`}>
	{#if saved.includes(set.id)}
		<span class="save-icon"> <Icon width="45px" solid={true} src={Bookmark} /></span>
	{/if}
	<a href={'/set/' + set.id} style="text-decoration: none; color: inherit;">
		<span class="header">
			<span>{set.name} </span>
			{#if edit}
				<span class="desktop-icon">
					<span on:click={() => window.location.assign('/create?set=' + set.id)}>
						<Icon src={Pencil} width="18px" />
					</span>
					<span style="flex: 1" />
					<span
						on:click={() => {
							promptDelete();
							indexCallback(index);
						}}
					>
						<Icon src={Trash} width="18px" />
					</span>
				</span>
			{/if}
		</span>
		<span class="card-info">
			<span
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
				>
				{set.flashcards.length}
				Terms</span
			>
			<span>
				<Icon src={Eye} solid={true} width="15px" />
				{#if set.views > 0}
					{set.views}
					View{`${set.views > 1 ? 's' : ''}`}
				{:else}
					No views
				{/if}
			</span>
		</span>
	</a>

	<span class="subtext">
		<img class="profile-img" src={set.author.image} alt="" /><a
			style="color: var(--text-color); text-decoration: none;"
			href={`/profile/${set.author.id}`}>{set.author.name}</a
		>
	</span>
	{#if edit}
		<span class="mobile-icon">
			<span on:click={() => window.location.assign('/create?set=' + set.id)}>
				<Icon class="desktop-icon" src={Pencil} width="22px" />
			</span>
			<span class="desktop-icon" style="flex: 1" />
			<Icon class="desktop-icon" src={Trash} width="22px" />
		</span>
	{/if}
</div>

<style>
	.main {
		position: relative;
	}

	div {
		padding: 20px 30px;
		background-color: var(--container-background);
		border: 1px solid var(--border);
		border-radius: 10px;
		font-size: 18px;
		font-weight: bold;
		margin: 0;
		width: fit-content;
		cursor: pointer;
		transition-duration: 0.1s;
		z-index: 1;
		display: flex;
		flex-direction: column;
		gap: 10px;
		flex-grow: 1;
		flex-shrink: 0;
		box-shadow: 0 0 15px var(--drop-shadow-color);
	}

	.save-icon {
		position: absolute;
		top: -12px;
		right: 5px;
		color: var(--save-icon-color);
	}

	.card-info {
		display: flex;
		flex-direction: row;
		gap: 20px;
	}

	.profile-img {
		width: 30px;
		height: 30px;
		border-radius: 50%;
	}

	.card-info > span {
		display: flex;
		flex-direction: row;
		gap: 5px;
		align-items: center;
		font-weight: normal;
		font-size: 16px;
	}

	.header {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 10px;
	}

	div:hover {
		transform: translateY(-3px);
		box-shadow: 0 20px 15px var(--drop-shadow-color);
		border-color: var(--text-color);
	}

	.subtext {
		margin-top: 10px;
		font-size: 16px;
		font-weight: normal;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.mobile-icon {
		display: none;
		justify-content: space-between;
		margin-top: 5px;
	}

	@media (max-width: 650px) {
		.desktop-icon {
			display: none;
		}

		.mobile-icon {
			display: flex;
		}
	}
</style>
