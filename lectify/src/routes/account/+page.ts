import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	const { token } = data;
	console.log('login page load, ', new Date().toISOString());
	console.log('token: ', token);

	return {
		token
	};
};
