<script>
	import { browser } from '$app/env';
	let kofi;
	if (browser) {
		try {
			kofiwidget2.init('Buy me a coffee <3', '#29abe0', 'F1F068LGZ');
			kofi = kofiwidget2.getHTML() ?? '';
		} catch (e) {
			console.log(e);
		}
	}
</script>

{@html kofi ?? ''}
