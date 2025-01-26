<script lang="ts">
	import Summary from '$lib/Summary.svelte';

	export let data;
</script>

{#if data.summaries && data.summaries.length > 0}
	<div class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
		{#each data.summaries as summary}
			<Summary {summary} minimal={true} />
		{/each}
	</div>
{:else}
	<p class="text-center text-gray-500">No summaries found.</p>
{/if}
