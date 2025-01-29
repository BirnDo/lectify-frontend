<script lang="ts">
	import { getToastStore, ProgressRadial } from '@skeletonlabs/skeleton';
	import { onDestroy, onMount } from 'svelte';
	import Summary from '$lib/Summary.svelte';
	import { invalidateAll } from '$app/navigation';

	export let data;
	const toastStore = getToastStore();
	let permissionRequested: boolean = false;

	// Reactive statement that runs whenever data.summary resolves
	$: {
		if (data.summary) {
			data.summary
				.then(async (summary) => {
					if (!summary.completed) {
						if (!permissionRequested) {
							requestNotificationPermission();
							permissionRequested = true;
						}
						await new Promise((resolve) => setTimeout(resolve, 5000));
						await invalidateAll();
					} else {
						toastStore.clear();
						if (typeof window !== 'undefined') {
							showFinishedNotification(summary);
						}
					}
				})
				.catch((err) => {
					console.error('Error processing summary:', err);
				});
		}
	}

	onDestroy(() => {
		toastStore.clear();
	});

	async function requestNotificationPermission() {
		try {
			if (
				typeof window !== 'undefined' &&
				'Notification' in window &&
				Notification.permission === 'granted'
			) {
				toastStore.trigger({
					message: "Notifications enabled! You'll be notified when your summary is ready.",
					timeout: 3000,
					background: 'variant-filled-success'
				});
			} else if (Notification.permission === 'denied') {
				toastStore.trigger({
					message:
						'Notifications are currently disabled. To receive alerts when your summary is ready, please enable notifications in your browser settings.',
					timeout: 5000,
					background: 'variant-filled-warning'
				});
			} else {
				toastStore.trigger({
					message: 'Please allow notifications to get alerts when your summary is ready.',
					background: 'variant-filled-warning',
					autohide: false
				});

				const permission = await Notification.requestPermission();
				toastStore.clear();
				if (permission === 'granted') {
					toastStore.trigger({
						message: "Notifications enabled! You'll be notified when your summary is ready.",
						timeout: 3000,
						background: 'variant-filled-success'
					});
				} else if (permission === 'denied') {
					toastStore.trigger({
						message: "Notifications disabled. You won't receive alerts when your summary is ready.",
						timeout: 3000,
						background: 'variant-filled-warning'
					});
				}
			}
		} catch (error) {
			toastStore.clear();
			console.error('Error requesting notification permission:', error);
		}
		permissionRequested = false;
	}

	function showFinishedNotification(summary: Summary) {
		if (Notification.permission === 'granted') {
			try {
				const notification = new Notification('Summary Ready!', {
					body: `Your summary "${summary.title || summary.fileName}" is ready to view.`,
					icon: '/favicon.png',
					badge: '/favicon.png',
					tag: `summary-${summary._id}`,
					requireInteraction: true
				});
			} catch (error) {
				console.error('Error creating notification:', error);
			}
		}
	}
</script>

{#await data.summary}
	<div
		class="fixed inset-0 bg-surface-100/50 backdrop-blur-sm flex items-center justify-center z-50"
	>
		<ProgressRadial meter="stroke-surface-900" track="stroke-surface-500/30" width="w-24" />
	</div>
{:then summary}
	<Summary {summary} minimal={false} />
{:catch error}
	<p class="text-center text-xl text-gray-500">{error.body.message}</p>
{/await}
