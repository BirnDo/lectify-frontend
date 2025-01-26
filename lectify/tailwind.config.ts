import { join } from 'path';
import type { Config } from 'tailwindcss';
import { skeleton } from '@skeletonlabs/tw-plugin';
import { myCustomTheme } from './custom-theme';
import forms from '@tailwindcss/forms';

export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			screens: {
				'xs': '400px'
			}
		}
	},
	plugins: [
		forms,
		skeleton({
			themes: {
				preset: ['skeleton', 'wintry', 'crimson'],
				custom: [myCustomTheme]
			}
		})
	],
	darkMode: 'selector'
} satisfies Config;
