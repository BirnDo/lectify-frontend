import type { Summary } from '../../../models/Summary';
import type { PageLoad } from './$types';
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export const load: PageLoad = async ({ data, params }) => {
	const { token } = data;
	console.log('summary page load');
	console.log(token);
	let summary: Summary | null = null;
	if (token) {
		summary = await fetchSummary(params.id); // preload if server cookie jwt is present
		console.log(summary);
	}
	return {
		id: params.id,
		token,
		summary,
		fetchSummary
	};
};

async function fetchSummary(id: string) {
	const response = await fetch(API_ENDPOINT + '/entry?_id=' + id, {
		method: 'GET',
		credentials: 'include'
	});
	const summary: Summary = await response.json();

	console.log('Fetched summary:', summary);
	summary.transcriptionQuality = mapTranscriptionQuality(summary.transcriptionQuality);

	return summary;
}

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
