<main>
	<span class="header"><p>1</p></span>
	<div>
		<span>
			<p>Term</p>
			<textarea rows="4" data-gramm="false" placeholder="Molecule" />
		</span>
		<span>
			<p>Definition</p>
			<textarea
				data-gramm="false"
				rows="4"
				placeholder="A group of atoms bonded together, representing the smallest fundamental unit of a chemical compound that can take part in a chemical reaction."
			/>
		</span>
	</div>
</main>

<style>
	main {
		background-color: var(--light-pink);
		width: calc(100%);
		border-radius: 5px;
		border: var(--border) 1px solid;
		display: flex;
		flex-direction: column;
	}

	.header {
		border-bottom: var(--border) 1px solid;
		width: calc(100% - 20px);
		padding: 10px;
	}

	div {
		display: flex;
		gap: 10px;
		padding: 10px;
	}

	span {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	span * {
		flex: 1;
	}

	textarea {
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		font-family: sans-serif;
		resize: none;
	}

	p {
		margin: 5px;
		color: var(--dark-pink);
		font-weight: bold;
	}

	@media (max-width: 600px) {
		div {
			flex-direction: column;
		}
	}
</style>
