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

	let files: FileList;

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
		}
		console.log('Files:', files);
		console.log('Transcription Quality:', transcriptionQuality);
		console.log('Summary Type:', summaryType);
	}
</script>

<div>
	<Toast />
	<form class="w-full space-y-6 mt-4 px-8" on:submit={handleSubmit}>
		<h1 class="text-2xl text-center font-semibold">Convert lecture to summary</h1>
		<FileDropzone
			class="w-full mx-auto max-w-xl sm:h-32"
			name="files"
			bind:files
			accept="audio/*,video/*"
		>
			<svelte:fragment slot="lead"
				><svg
					class="text-3xl m-auto"
					xmlns="http://www.w3.org/2000/svg"
					width="1em"
					height="1em"
					viewBox="0 0 24 24"
				>
					<path
						fill="currentColor"
						d="M11 14.825V18q0 .425.288.713T12 19t.713-.288T13 18v-3.175l.9.9q.15.15.338.225t.375.063t.362-.088t.325-.225q.275-.3.288-.7t-.288-.7l-2.6-2.6q-.15-.15-.325-.212T12 11.425t-.375.063t-.325.212l-2.6 2.6q-.3.3-.287.7t.312.7q.3.275.7.288t.7-.288zM6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h7.175q.4 0 .763.15t.637.425l4.85 4.85q.275.275.425.638t.15.762V20q0 .825-.587 1.413T18 22zm7-14q0 .425.288.713T14 9h4l-5-5z"
					/>
				</svg></svelte:fragment
			>
			<svelte:fragment slot="message"
				><b>Upload a lecture recording</b> or drag and drop</svelte:fragment
			>
			<svelte:fragment slot="meta">audio or video allowed</svelte:fragment>
		</FileDropzone>

		<fieldset class="space-y-2 flex">
			<legend class="mx-auto font-semibold">Transcription Quality</legend>
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
