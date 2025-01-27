import type { Summary } from '../../../models/Summary';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, data, params }) => {
	const fetchSummary = async () => {
		console.log('fetching Summary with id: ', params.id);
		const res = await fetch(`/api/entry?_id=${params.id}`);

		if (res.status === 401) {
			error(401, {
				message: 'This summary is not public.'
			});
		} else if (res.status === 404) {
			error(404, {
				message: 'Summary not found.'
			});
		} else if (!res.ok) {
			throw error(res.status, {
				message: `Could not load summary: ${res.statusText}`
			});
		}

		let summary: Summary = await res.json();
		summary.transcriptionQuality = mapTranscriptionQuality(summary.transcriptionQuality);

		return summary;
	};

	const { token } = data;
	console.log('summary page load');
	console.log('token: ', token);

	let summary: Summary | null = await fetchSummary();
	let isLoading = true; // Add this line
	return {
		token,
		summary,
		fetchSummary,
		isLoading // Add this line
	};
};

function mapTranscriptionQuality(quality: string): Summary['transcriptionQuality'] {
	switch (quality) {
		case 'tiny':
			return 'Basic';
		case 'small':
			return 'Standard';
		case 'large':
			return 'High';
		default:
			throw new Error(`Invalid transcription quality: ${quality}`);
	}
}
