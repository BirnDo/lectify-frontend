import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('jwt');
	console.log('login server load: ' + new Date().toISOString());
	console.log('token: ', token);
	return {
		token
	};
};
