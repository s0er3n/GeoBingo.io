// import adapter from '@sveltejs/adapter-netlify';
import adapter from '@sveltejs/adapter-static';

import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		trailingSlash: 'always',
		adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: true
		}),
		// prerender: { default: true }
	},

	preprocess: [
		preprocess({
			postcss: true
		})
	]
};

export default config;
