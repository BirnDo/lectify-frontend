<script lang="ts">
	import { clipboard, getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ToastSettings } from '@skeletonlabs/skeleton';
	import type { Summary } from '../models/Summary';
	const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

	export let summary: Summary;
	export let minimal: boolean;
	const modalStore = getModalStore();
	const toastStore = getToastStore();
	console.log(summary);
	function formatDuration(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		if (minutes > 0) {
			return `${minutes}m ${remainingSeconds}s`;
		} else {
			return `${remainingSeconds}s`;
		}
	}
	function showCopyToast(message: string) {
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
			body: summary?.transcriptionText,
			modalClasses: 'p-8',
			response: (r: boolean) => {
				if (r) {
					navigator.clipboard.writeText(summary?.transcriptionText || '');
					showCopyToast('Transcription copied to clipboard!');
				}
			}
		};
		modalStore.trigger(m);
	}
	async function handleDelete() {
		const m: ModalSettings = {
			type: 'confirm',
			title: 'Delete Summary',
			body: 'Are you sure you want to delete this summary? This action cannot be undone.',
			buttonTextConfirm: 'Delete',
			buttonTextCancel: 'Cancel',
			modalClasses: 'p-8',
			response: async (r: boolean) => {
				if (r) {
					try {
						const res = await fetch(API_ENDPOINT + `/entry?_id=${summary._id}`, {
							method: 'DELETE',
							credentials: 'include'
						});

						if (res.ok) {
							toastStore.trigger({
								message: 'Summary deleted successfully',
								background: 'variant-filled-success'
							});
							window.location.href = '/history';
						} else {
							toastStore.trigger({
								message: 'Failed to delete summary',
								background: 'variant-filled-error'
							});
						}
					} catch (e) {
						console.log(e);
					}
				}
			}
		};
		modalStore.trigger(m);
	}

	async function handleShare() {
		const m: ModalSettings = {
			type: 'confirm',
			title: summary.isPublic ? 'Make Private' : 'Share Summary',
			body: summary.isPublic
				? 'This will make your summary private. Continue?'
				: 'This will make your summary public and shareable. Continue?',
			buttonTextConfirm: summary.isPublic ? 'Make Private' : 'Share',
			buttonTextCancel: 'Cancel',
			modalClasses: 'p-8',
			response: async (r: boolean) => {
				if (r) {
					try {
						const res = await fetch(API_ENDPOINT + `/entry?_id=${summary._id}`, {
							method: 'PUT',
							credentials: 'include',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({ isPublic: !summary.isPublic })
						});

						if (res.ok) {
							summary.isPublic = !summary.isPublic;
							if (summary.isPublic) {
								const url = window.location.href;
								await navigator.clipboard.writeText(url);
								toastStore.trigger({
									message: 'Link copied to clipboard!',
									background: 'variant-filled-success'
								});
							} else {
								toastStore.trigger({
									message: 'Summary is now private',
									background: 'variant-filled-success'
								});
							}
						} else {
							toastStore.trigger({
								message: 'Failed to update sharing settings',
								background: 'variant-filled-error'
							});
						}
					} catch (e) {
						console.error(e);
					}
				}
			}
		};
		modalStore.trigger(m);
	}
</script>

<div
	class="flex flex-col justify-start relative p-6 max-w-4xl bg-white dark:bg-surface-800 shadow-lg rounded-lg"
>
	<!-- Delete Button -->
	<button
		on:click={handleDelete}
		class="absolute top-2 right-2 p-2 text-error-500 hover:text-error-700 transition-colors"
		aria-label="Delete summary"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M6 18L18 6M6 6l12 12"
			/>
		</svg>
	</button>
	<!-- Progress/Complete Icon -->
	<div class="flex items-center">
		{#if summary.completed}
			<!-- Completed Icon -->
			<!-- prettier-ignore -->
			<svg class="w-6 h-6 text-primary-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
			<span class="text-primary-600 font-semibold">Completed</span>
		{:else}
			<!-- Progress Icon -->
			<!-- prettier-ignore -->
			<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-warning-500 mr-2 animate-spin" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22q-2.05 0-3.875-.788t-3.187-2.15t-2.15-3.187T2 12q0-2.075.788-3.887t2.15-3.175t3.187-2.15T12 2q.425 0 .713.288T13 3t-.288.713T12 4Q8.675 4 6.337 6.338T4 12t2.338 5.663T12 20t5.663-2.337T20 12q0-.425.288-.712T21 11t.713.288T22 12q0 2.05-.788 3.875t-2.15 3.188t-3.175 2.15T12 22"/></svg>
			<span class="text-warning-600 font-semibold">In Progress</span>
		{/if}
	</div>
	<!-- summary information text-->
	<div class="mt-2 px-1">
		<h1 class="text-2xl font-semibold break-all">
			{summary.title}
		</h1>
		<p class="text-surface-500-400-token">
			<span class="break-all">{summary.fileName}</span>
			<span class="whitespace-nowrap">
				• {formatDuration(Number.parseFloat(summary.duration))}</span
			>
		</p>
		<p class="text-surface-400-500-token text-sm">
			Created on {new Date(summary.createdAt)
				.toLocaleString('de-DE', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				})
				.replace(',', ' at	')}
		</p>
	</div>
	<!-- summary information quality, type-->
	<div class="flex-1 mt-4 {summary.completed ? 'mb-6' : ''}">
		<span class="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mr-2">
			Transcription: {summary.transcriptionQuality}
		</span>
		<span class="inline-block bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">
			Summary: {summary.summaryType}
		</span>
	</div>
	<!-- if displayed in history, link to summary button -->
	{#if minimal}
		<footer class="mt-auto">
			<div class="flex justify-between">
				<a href={`/summary/${summary._id}`} class="btn variant-filled px-4 py-2">
					{#if summary.completed}
						View Summary
					{:else}
						Check Progress
					{/if}
				</a>
			</div>
		</footer>
		<!-- if in detailed summary, display text and transcription button -->
	{:else if summary.completed}
		<main class="flex-1 relative mb-6">
			<p class="px-1">{summary.summaryText}</p>
			<div class="absolute -bottom-4 -right-4">
				<button
					use:clipboard={summary.summaryText}
					on:click={() => showCopyToast('Summary copied to clipboard!')}
				>
					<!-- Clipboard Icon -->
					<!-- prettier-ignore -->
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm0-2h9V4H9zm-4 6q-.825 0-1.412-.587T3 20V7q0-.425.288-.712T4 6t.713.288T5 7v13h10q.425 0 .713.288T16 21t-.288.713T15 22zm4-6V4z"/></svg>
				</button>
				<button on:click={handleShare} class={summary.isPublic ? 'text-success-500' : ''}>
					<!-- Share Icon -->
					<!-- prettier-ignore -->
					<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M11.293 2.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1-1.414 1.414L13 5.414V15a1 1 0 1 1-2 0V5.414L9.707 6.707a1 1 0 0 1-1.414-1.414zM4 11a2 2 0 0 1 2-2h2a1 1 0 0 1 0 2H6v9h12v-9h-2a1 1 0 1 1 0-2h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/></svg>
				</button>
			</div>
		</main>
		<footer class="">
			<div class="">
				<button on:click={() => handleModal()} class="btn variant-filled m-auto"
					>Show Transcription</button
				>
			</div>
		</footer>
	{/if}
</div>
