<script lang="ts">
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import Summary from '$lib/Summary.svelte';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import SummarySkeleton from '$lib/SummarySkeleton.svelte';
	export let data;
</script>

{#await data.summaries}
	<!-- <div
		class="fixed inset-0 bg-surface-100/50 backdrop-blur-sm flex items-center justify-center z-50"
	>
		<ProgressRadial meter="stroke-surface-900" track="stroke-surface-500/30" width="w-24" />
	</div> -->
	<div class="grid gap-8 grid-cols-[repeat(auto-fit,minmax(330px,1fr))]">
		{#each Array(8) as _}
			<SummarySkeleton />
		{/each}
	</div>
{:then summaries}
	<div class="grid gap-8 grid-cols-[repeat(auto-fit,minmax(380px,1fr))]">
		{#each summaries as summary (summary._id)}
			<Summary {summary} minimal={true} />
		{/each}
	</div>
{:catch error}
	<p class="text-center text-gray-500">{error.body.message}</p>
{/await}
