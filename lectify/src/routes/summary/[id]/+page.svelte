<script lang="ts">
	import { clipboard, getToastStore, Toast, Modal, getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ToastSettings } from '@skeletonlabs/skeleton';
	import { onDestroy, onMount } from 'svelte';
	export let data;

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	let interval: NodeJS.Timeout;

	onMount(async () => {
		if (!data.summary?.completed) {
			interval = setInterval(async () => {
				const updatedSummary = await data.fetchSummary(data.id);
				if (updatedSummary?.completed) {
					data.summary = updatedSummary;
					clearInterval(interval);
				}
				console.log('Polling for updated summary...');
			}, 5000);
		}
	});

	onDestroy(() => {
		if (interval) {
			clearInterval(interval);
			console.log('Polling stopped');
		}
	});

	function handleCopy(message: string) {
		const t: ToastSettings = {
			message: message,
			timeout: 1800,
			background: 'variant-filled'
		};
		toastStore.trigger(t);
	}
	function handleModal() {
		const m: ModalSettings = {
			type: 'confirm',
			title: 'Transcription',
			buttonTextConfirm: 'Copy to Clipboard',
			body: data.summary?.transcriptionText,
			response: (r: boolean) => {
				if (r) {
					navigator.clipboard.writeText(data.summary?.transcriptionText || '');
					handleCopy('Transcription copied to clipboard!');
				}
			}
		};
		modalStore.trigger(m);
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
</script>

<div class="container mx-auto p-6 flex flex-col">
	{#if data.summary}
		<div
			class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex flex-col flex-1"
		>
			<!-- Header -->
			<header class="p-6 border-b">
				<div class="flex items-center mb-4">
					{#if data.summary.completed}
						<!-- Completed Icon -->
						<!-- prettier-ignore -->
						<svg class="w-6 h-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
						<span class="text-green-600 font-semibold">Completed</span>
					{:else}
						<!-- Progress Icon -->
						<!-- prettier-ignore -->
						<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-yellow-500 mr-2 animate-spin" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22q-2.05 0-3.875-.788t-3.187-2.15t-2.15-3.187T2 12q0-2.075.788-3.887t2.15-3.175t3.187-2.15T12 2q.425 0 .713.288T13 3t-.288.713T12 4Q8.675 4 6.337 6.338T4 12t2.338 5.663T12 20t5.663-2.337T20 12q0-.425.288-.712T21 11t.713.288T22 12q0 2.05-.788 3.875t-2.15 3.188t-3.175 2.15T12 22"/></svg>
						<span class="text-yellow-600 font-semibold">In Progress</span>
					{/if}
				</div>
				<h1 class="text-3xl font-bold">
					{#if data.summary.completed}
						{data.summary.title}
					{:else}
						<span class="break-all">{data.summary.fileName}</span>{/if}
				</h1>
				<p class="text-gray-600 break-all">
					{data.summary.fileName} • {formatDuration(Number.parseFloat(data.summary.duration))}
				</p>
				<p class="text-gray-500 text-sm">
					Created on {new Date(data.summary.createdAt).toLocaleDateString()}
				</p>
				<div class="mt-4 flex-1">
					<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
						Transcription: {data.summary.transcriptionQuality}
					</span>
					<span class="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
						Summary: {data.summary.summaryType}
					</span>
				</div>
			</header>
			{#if data.summary.completed}
				<!-- Main Content -->
				<main class="p-6 flex-1 relative">
					<p>{data.summary.summaryText}</p>
					<button
						class="absolute bottom-2 right-1"
						use:clipboard={data.summary.summaryText}
						on:click={() => handleCopy('Summary copied to clipboard!')}
					>
						<!-- Clipboard Icon -->
						<!-- prettier-ignore -->
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm0-2h9V4H9zm-4 6q-.825 0-1.412-.587T3 20V7q0-.425.288-.712T4 6t.713.288T5 7v13h10q.425 0 .713.288T16 21t-.288.713T15 22zm4-6V4z"/></svg
						></button
					>
				</main>

				<!-- Footer with Buttons -->
				<footer class="p-6 border-t">
					<div class="">
						<button on:click={() => handleModal()} class="btn variant-filled m-auto"
							>Show Transcription</button
						>
					</div>
				</footer>
			{/if}
		</div>
	{:else}
		<p class="text-center text-xl text-gray-500">Summary not found.</p>
	{/if}
	<Toast />
	<Modal />
</div>
