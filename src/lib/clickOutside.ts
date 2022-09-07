export const clickOutside = (node: Node, params: Function): SvelteActionReturnType => {
	const handleClick = (event: Event) => {
		if (node && !node.contains(event.target) && !event.defaultPrevented) {
			params();
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
};
