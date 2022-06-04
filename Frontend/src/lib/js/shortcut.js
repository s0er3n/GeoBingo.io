export const shortcut = (node, params) => {
	let handler;
	const removeHandler = () => window.removeEventListener('keydown', handler);
	const setHandler = () => {
		removeHandler();
		if (!params) return;
		handler = (e) => {
			if (params.code !== e.code) return;
			if (!params.default) {
				e.preventDefault();
			}
			params.callback ? params.callback() : node.click();
		};
		window.addEventListener('keydown', handler);
	};
	setHandler();
	return {
		update: setHandler,
		destroy: removeHandler
	};
};
