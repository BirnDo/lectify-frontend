<script lang="ts">
	import { getToastStore, ProgressRadial } from '@skeletonlabs/skeleton';
	import { onDestroy, onMount } from 'svelte';
	import Summary from '$lib/Summary.svelte';

	export let data;
	const toastStore = getToastStore();

	let loading: boolean = false;
	let interval: NodeJS.Timeout;

	async function requestNotificationPermission() {
		if ('Notification' in window) {
			try {
				if (Notification.permission === 'granted') {
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
							message:
								"Notifications disabled. You won't receive alerts when your summary is ready.",
							timeout: 3000,
							background: 'variant-filled-warning'
						});
					}
				}
			} catch (error) {
				toastStore.clear();
				console.error('Error requesting notification permission:', error);
			}
		}
	}

	onMount(async () => {
		if (!data.summary?.completed) {
			await requestNotificationPermission();
			interval = setInterval(async () => {
				try {
					loading = true;
					const updatedSummary = await data.fetchSummary();
					loading = false;

					if (updatedSummary?.completed && !data.summary?.completed) {
						data.summary = updatedSummary;
						clearInterval(interval);
						if (Notification.permission === 'granted') {
							try {
								const notification = new Notification('Summary Ready!', {
									body: `Your summary "${updatedSummary.title || updatedSummary.fileName}" is ready to view.`,
									icon: '/favicon.png',
									badge: '/favicon.png',
									tag: `summary-${updatedSummary._id}`,
									requireInteraction: true
								});
							} catch (error) {
								console.error('Error creating notification:', error);
							}
						}
					}
				} catch (error) {
					console.error('Error fetching summary:', error);
				}
			}, 5000);
		}
	});

	onDestroy(() => {
		toastStore.clear();
		if (interval) {
			clearInterval(interval);
			console.log('Polling stopped');
		}
	});
</script>

{#if loading}
	<div
		class="fixed inset-0 bg-surface-100/50 backdrop-blur-sm flex items-center justify-center z-50"
	>
		<ProgressRadial meter="stroke-surface-900" track="stroke-surface-500/30" width="w-24" />
	</div>
{/if}
<Summary summary={data.summary} minimal={false} />
