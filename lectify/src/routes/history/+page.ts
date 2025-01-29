import { error } from '@sveltejs/kit';
import type { Summary } from '../../models/Summary';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, data }) => {
	const token = data.token;

	// const res = await fetch(`/api/history`);

	// if (res.status === 401) error(res.status, 'Please login to view your history.');
	// else if (!res.ok) {
	// 	error(res.status, {
	// 		message: `Error loading history: ${res.statusText}`
	// 	});
	// }
	// let summaries: Summary[] = (await res.json())
	// 	.map((summary: Summary) => ({
	// 		...summary,
	// 		transcriptionQuality: mapTranscriptionQuality(summary.transcriptionQuality)
	// 	}))
	// 	.sort((a: Summary, b: Summary) => {
	// 		if (a.completed !== b.completed) {
	// 			return a.completed ? 1 : -1;
	// 		}
	// 		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	// 	});

	// if (summaries.length === 0) error(404, 'No history for your account found.');

	return {
		token,
		summaries: fetch(`/api/history`).then(async (res) => {
			if (res.status === 401) {
				error(401, 'Please login to view your history.');
			} else if (!res.ok) {
				error(res.status, `Error loading history: ${res.statusText}`);
			} else {
				let summaries: Summary[] = (await res.json())
					.map((summary: Summary) => ({
						...summary,
						transcriptionQuality: mapTranscriptionQuality(summary.transcriptionQuality)
					}))
					.sort((a: Summary, b: Summary) => {
						if (a.completed !== b.completed) {
							return a.completed ? 1 : -1;
						}
						return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
					});
				if (summaries.length === 0) error(404, 'No history for your account found.');
				return summaries;
			}
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
