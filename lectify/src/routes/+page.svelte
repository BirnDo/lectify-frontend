<script lang="ts">
	import {
		FileDropzone,
		RadioGroup,
		RadioItem,
		getToastStore,
		Toast,
		type ToastSettings,
		ProgressRadial
	} from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
	const toastStore = getToastStore();

	let title: string = '';
	let loading: boolean = false;
	let files: File[] = [];
	let transcriptionQuality: string = 'small';
	let summaryType: string = 'Brief';

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (!files || files.length === 0) {
			const t: ToastSettings = {
				message: 'Please upload a file before submitting.',
				timeout: 3000,
				background: 'variant-filled-error'
			};
			toastStore.trigger(t);
		} else if (!title) {
			const t: ToastSettings = {
				message: 'Please enter a title before submitting.',
				timeout: 3000,
				background: 'variant-filled-error'
			};
			toastStore.trigger(t);
		} else {
			loading = true;
			console.log(files);

			const formdata = new FormData();
			files.forEach((file) => {
				formdata.append('files', file, file.name);
			});

			const res = await fetch(
				API_ENDPOINT +
					`/process?fileName=${files[0].name}&title=${title}&model=${transcriptionQuality}&summaryType=${summaryType}`,
				{
					method: 'POST',

					credentials: 'include',
					body: formdata
				}
			);
			if (res.status == 401) {
				const t: ToastSettings = {
					message: 'Please login to convert lectures.',
					timeout: 3000,
					background: 'variant-filled-error'
				};
				toastStore.trigger(t);
				loading = false;
			} else {
				type ProcessResponse = {
					ids: string[];
				};
				const data: ProcessResponse = await res.json();
				loading = false;
				if (data.ids.length === 1) goto(`/summary/${data.ids[0]}`, { replaceState: true });
				else goto(`/history`, { replaceState: true });
			}
		}
	}

	function removeFile(index: number) {
		files = files.filter((_, i) => i !== index);
		// Reset the FileDropzone input
		const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
		if (fileInput) fileInput.value = '';
	}

	function handleAddFiles(event: Event) {
		const input = event.target as HTMLInputElement;
		const newFiles = input.files;

		if (newFiles) {
			const duplicates: string[] = [];
			const uniqueFiles = Array.from(newFiles).filter((newFile) => {
				const isDuplicate = files.some(
					(existingFile) => existingFile.name === newFile.name && existingFile.size == newFile.size
				);
				if (isDuplicate) {
					duplicates.push(newFile.name);
				}
				return !isDuplicate;
			});

			if (duplicates.length > 0) {
				toastStore.trigger({
					message: `${duplicates.join(', ')} already added`,
					background: 'variant-soft-warning'
				});
			}

			files = [...files, ...uniqueFiles];
			// Reset input to allow re-adding same file
			input.value = '';
		}
	}
</script>

<div>
	{#if loading}
		<div
			class="fixed inset-0 bg-surface-100/50 backdrop-blur-sm flex items-center justify-center z-50"
		>
			<ProgressRadial meter="stroke-surface-900" track="stroke-surface-500/30" width="w-24" />
		</div>
	{/if}
	<form class="flex flex-col items-center w-full space-y-6 p-6" on:submit={handleSubmit}>
		<h1 class="text-3xl text-center font-semibold">Convert lecture to summary</h1>
		<FileDropzone
			class="w-full mx-auto max-w-xl sm:h-32 "
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
						class="flex items-center btn variant-soft-surface py-1 active:transform-none active:brightness-110"
					>
						<p class="text-center flex-1">
							{file.name.length > 30
								? `${file.name.slice(0, 19)}...${file.name.slice(file.name.lastIndexOf('.') - 3)}`
								: file.name}
						</p>
						<button
							type="button"
							on:click={() => removeFile(i)}
							class="ml-2 focus:outline-none"
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
		<label class="flex flex-col items-center space-y-2">
			<span class="font-semibold">Title</span>
			<input
				type="text"
				class="input w-80 text-center"
				placeholder="Enter a title for your summary"
				bind:value={title}
			/>
		</label>
		<fieldset class="flex flex-col items-center space-y-2">
			<div><legend class="font-semibold">Transcription Quality</legend></div>
			<RadioGroup class="w-80">
				<RadioItem bind:group={transcriptionQuality} name="quality" value={'tiny'}>Basic</RadioItem>
				<RadioItem default bind:group={transcriptionQuality} name="quality" value={'small'}
					>Standard</RadioItem
				>
				<RadioItem bind:group={transcriptionQuality} name="quality" value={'large'}>High</RadioItem>
			</RadioGroup>
		</fieldset>

		<fieldset class="flex flex-col items-center space-y-2">
			<div><legend class="font-semibold">Summary Type</legend></div>
			<RadioGroup class="w-80 ">
				<RadioItem bind:group={summaryType} name="summary" value={'Brief'}>Brief</RadioItem>
				<RadioItem default bind:group={summaryType} name="summary" value={'Detailed'}
					>Detailed</RadioItem
				>
				<RadioItem bind:group={summaryType} name="summary" value={'Comprehensive'}
					>Comprehensive</RadioItem
				>
			</RadioGroup>
		</fieldset>
		<button type="submit" class="btn variant-filled">Convert</button>
	</form>
</div>
