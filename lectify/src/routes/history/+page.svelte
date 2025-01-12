<!-- src/routes/summaries/+page.svelte -->
<script lang="ts">
	export let data;
</script>

<div class="container mx-auto p-6">
	<h1 class="text-4xl font-bold mb-8 text-center">Previous Summaries</h1>

	{#if data.summaries && data.summaries.length > 0}
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
			{#each data.summaries as summary}
				<div class="card min-w-fit flex flex-col h-full">
					<header class="card-header">
						<div class="flex">
							{#if summary.completed}
								<svg
									class="w-6 h-6 text-green-500 mr-2"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								<span class="text-green-600 font-semibold">Completed</span>
							{:else}
								<svg
									class="w-6 h-6 text-yellow-500 mr-2"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8v4l3 3"
									/>
								</svg>
								<span class="text-yellow-600 font-semibold">In Progress</span>
							{/if}
						</div>
					</header>
					<section class="px-4 flex-1">
						<h2 class="text-2xl font-semibold mb-2">{summary.title}</h2>
						<p class="text-gray-600 mb-2">{summary.fileName} • {summary.duration}</p>

						<div class="mb-4 min-w-9">
							<span
								class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2"
							>
								Transcription: {summary.transcriptionQuality}
							</span>
							<span
								class="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
							>
								Summary: {summary.summaryType}
							</span>
						</div>

						<p class="text-gray-500 text-sm mb-4">
							Created on {new Date(summary.createdAt).toLocaleDateString()}
						</p>

						{#if summary.completed}
							<p class="text-gray-700 mb-4">{summary.summaryText}</p>
						{/if}
					</section>
					<footer class="card-footer">
						<div class="flex justify-between">
							{#if summary.completed}
								<a href={`/summary/${summary.id}`} class="btn variant-filled px-4 py-2">
									View Summary
								</a>
								<a href={`/transcription/${summary.id}`} class="btn variant-outlined px-4 py-2">
									View Transcription
								</a>
							{:else}
								<a href={`/summary/${summary.id}`} class="btn variant-filled px-4 py-2">
									Check Progress
								</a>
							{/if}
						</div>
					</footer>
				</div>
			{/each}
		</div>
	{:else}
		<p class="text-center text-gray-500">No summaries found.</p>
	{/if}
</div>
