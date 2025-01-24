import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();
const apiUrl = process.env.VITE_API_ENDPOINT;

export default defineConfig({
	plugins: [sveltekit(), purgeCss()],
	server: {
		proxy: {
			'/api': {
				target: apiUrl,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	}
});
