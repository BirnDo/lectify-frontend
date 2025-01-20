<script lang="ts">
	import { onMount } from 'svelte';
	import type { Summary } from '../../models/Summary.js';
	const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

	export let data;
	const getCookie = (name: string) => {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) {
			const part = parts.pop();
			if (part) return part.split(';').shift();
		}
	};
	onMount(async () => {
		data.token = getCookie('token');
		console.log('Token:', data.token);
		data.summaries = await fetchSummaries();
	});
	function mapTranscriptionQuality(quality: string): string {
		switch (quality) {
			case 'tiny':
				return 'Basic';
			case 'small':
				return 'Standard';
			case 'large':
				return 'High';
			default:
				return 'Unknown';
		}
	}

	async function fetchSummaries() {
		try {
			const response = await fetch(API_ENDPOINT + '/history', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${data.token}`
				}
			});
			const summaries: Summary[] = await response.json();
			console.log('Fetched summary:', summaries);
			summaries.forEach(
				(summary) =>
					(summary.transcriptionQuality = mapTranscriptionQuality(summary.transcriptionQuality))
			);

			return summaries;
		} catch (error) {
			console.error('Failed to fetch summary:', error);
			return null;
		}
	}

	function formatDuration(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		if (minutes > 0) {
			return `${minutes}m ${remainingSeconds}s`;
		} else {
			return `${remainingSeconds}s`;
		}
	}
	console.log(data.summaries);
</script>

<div class="container mx-auto p-6">
	<h1 class="text-3xl font-bold mb-8 text-center">Previous Summaries</h1>
	{#if data.token}
		{#if data.summaries && data.summaries.length > 0}
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
				{#each data.summaries as summary}
					<div class="p-6 bg-white shadow-lg rounded-lg overflow-hidden flex flex-col flex-1">
						<!-- Header -->
						<header class="">
							<div class="flex items-center mb-4">
								{#if summary.completed}
									<!-- prettier-ignore -->
									<svg class="w-6 h-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
									<span class="text-green-600 font-semibold">Completed</span>
								{:else}
									<!-- prettier-ignore -->
									<svg xmlns="http://www.w3.org/2000/svg"	class="w-6 h-6 text-yellow-500 mr-2 animate-spin" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22q-2.05 0-3.875-.788t-3.187-2.15t-2.15-3.187T2 12q0-2.075.788-3.887t2.15-3.175t3.187-2.15T12 2q.425 0 .713.288T13 3t-.288.713T12 4Q8.675 4 6.337 6.338T4 12t2.338 5.663T12 20t5.663-2.337T20 12q0-.425.288-.712T21 11t.713.288T22 12q0 2.05-.788 3.875t-2.15 3.188t-3.175 2.15T12 22"/></svg>
									<span class="text-yellow-600 font-semibold">In Progress</span>
								{/if}
							</div>
							<h2 class="text-2xl font-semibold mb-2">
								{#if summary.completed}
									{summary.title}
								{:else}
									<span class="break-all">{summary.fileName}</span>{/if}
							</h2>
							<p class="text-gray-600 break-all">
								{summary.fileName} • {formatDuration(summary.duration)}
							</p>
							<p class="text-gray-500 text-sm">
								Created on {new Date(summary.createdAt).toLocaleDateString()}
							</p>
							<div class="mt-4 flex-1">
								<!-- prettier-ignore -->
								<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
									Transcription: {summary.transcriptionQuality}
								</span>
								<!-- prettier-ignore -->
								<span class="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
									Summary: {summary.summaryType}
								</span>
							</div>
						</header>

						<!-- Footer -->
						<footer class="mt-6">
							<div class="flex justify-between">
								<a href={`/summary/${summary._id}`} class="btn variant-filled px-4 py-2">
									{#if summary.completed}View Summary
									{:else}
										Check Progress
									{/if}
								</a>
							</div>
						</footer>
					</div>
				{/each}
			</div>
		{:else}
			<p class="text-center text-gray-500">No summaries found.</p>
		{/if}
	{:else}
		<p class="text-center text-gray-500">Please login to view your summaries.</p>
	{/if}
</div>
