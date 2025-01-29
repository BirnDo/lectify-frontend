import type { Summary } from '../../../models/Summary';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
export const load: PageLoad = async ({ fetch, data, params }) => {
	const { token } = data;
	console.log('summary page load');
	console.log('token: ', token);

	return {
		token,
		summary: fetch(`/api/entry?_id=${params.id}`)
			.then(async (res) => {
				if (res.status === 401) {
					error(401, 'This summary is not public.');
				} else if (res.status === 404) {
					error(404, 'Summary not found.');
				} else if (!res.ok) {
					error(res.status, `Could not load summary: ${res.statusText}`);
				}
				const summary = await res.json();
				summary.transcriptionQuality = mapTranscriptionQuality(summary.transcriptionQuality);
				return summary;
			})
			.catch((err) => {
				error(err.status, err.body.message);
			})
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
