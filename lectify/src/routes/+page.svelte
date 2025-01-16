<script lang="ts">
	import {
		FileDropzone,
		RadioGroup,
		RadioItem,
		getToastStore,
		Toast,
		type ToastSettings
	} from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	let files: File[] = [];
	let transcriptionQuality: number = 1;
	let summaryType: number = 0;

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (!files || files.length === 0) {
			const t: ToastSettings = {
				message: 'Please upload a file before submitting.',
				timeout: 3000,
				background: 'variant-filled-error'
			};
			toastStore.trigger(t);
		} else console.log(files);
	}

	function removeFile(index: number) {
		files = files.filter((_, i) => i !== index);
	}

	function handleAddFiles(event: Event) {
		const input = event.target as HTMLInputElement;
		const newFiles = input.files;
		if (newFiles) files = [...files, ...Array.from(newFiles)];
	}
</script>

<div>
	<Toast />
	<form class="w-full space-y-6 p-6" on:submit={handleSubmit}>
		<h1 class="text-3xl text-center font-semibold">Convert lecture to summary</h1>
		<FileDropzone
			class="w-full mx-auto max-w-xl sm:h-32"
			name="files"
			on:change={handleAddFiles}
			accept="audio/*,video/*"
			multiple
		>
			<svelte:fragment slot="lead">
				<!-- Upload Icon -->
				<!-- prettier-ignore -->
				<svg class="text-3xl m-auto" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 14.825V18q0 .425.288.713T12 19t.713-.288T13 18v-3.175l.9.9q.15.15.338.225t.375.063t.362-.088t.325-.225q.275-.3.288-.7t-.288-.7l-2.6-2.6q-.15-.15-.325-.212T12 11.425t-.375.063t-.325.212l-2.6 2.6q-.3.3-.287.7t.312.7q.3.275.7.288t.7-.288zM6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h7.175q.4 0 .763.15t.637.425l4.85 4.85q.275.275.425.638t.15.762V20q0 .825-.587 1.413T18 22zm7-14q0 .425.288.713T14 9h4l-5-5z"/></svg></svelte:fragment
			>
			<svelte:fragment slot="message"
				><b>Upload a lecture recording</b> or drag and drop</svelte:fragment
			>
			<svelte:fragment slot="meta">audio or video allowed</svelte:fragment>
		</FileDropzone>
		{#if files && files.length > 0}
			<div class="flex flex-wrap justify-center items-center gap-4">
				{#each files as file, i}
					<div
						class="flex items-center bg-surface-200 p-2 pl-5 rounded-3xl break-all border border-surface-400"
					>
						<p class="text-center flex-1">{file.name}</p>
						<button
							type="button"
							on:click={() => removeFile(i)}
							class="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
							aria-label="Remove file"
						>
							<!-- X Icon -->
							<!-- prettier-ignore -->
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
						</button>
					</div>
				{/each}
			</div>
		{/if}

		<fieldset class="space-y-2 flex">
			<legend class="text-center font-semibold">Transcription Quality</legend>
			<RadioGroup class="mx-auto w-80">
				<RadioItem bind:group={transcriptionQuality} name="quality" value={0}>Basic</RadioItem>
				<RadioItem default bind:group={transcriptionQuality} name="quality" value={1}
					>Standard</RadioItem
				>
				<RadioItem bind:group={transcriptionQuality} name="quality" value={2}>High</RadioItem>
			</RadioGroup>
		</fieldset>

		<fieldset class="space-y-2 flex">
			<legend class="text-center font-semibold">Summary Type</legend>
			<RadioGroup class="mx-auto w-80">
				<RadioItem bind:group={summaryType} name="summary" value={0}>Brief</RadioItem>
				<RadioItem default bind:group={summaryType} name="summary" value={1}>Detailed</RadioItem>
				<RadioItem bind:group={summaryType} name="summary" value={2}>Comprehensive</RadioItem>
			</RadioGroup>
		</fieldset>
		<div class="flex">
			<button type="submit" class="btn variant-filled mt-2 m-auto">Convert</button>
		</div>
	</form>
</div>
