import type { Summary } from '../../models/Summary';
import type { PageLoad } from './$types';
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export const load: PageLoad = async ({ data }) => {
	const { token } = data;
	console.log(token);
	let summaries: Summary[] = [];
	if (token) {
		summaries = await fetchSummaries(); // preload if server cookie jwt is present
		console.log(summaries);
	}
	return {
		token,
		summaries,
		fetchSummaries
	};
};

async function fetchSummaries() {
	const response = await fetch(API_ENDPOINT + '/history', {
		method: 'GET',
		credentials: 'include'
	});
	const summaries: Summary[] = await response.json();
	console.log('Fetched summaries');
	console.log(summaries);

	summaries.forEach(
		(summary) =>
			(summary.transcriptionQuality = mapTranscriptionQuality(summary.transcriptionQuality))
	);

	return summaries;
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
