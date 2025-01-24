import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('jwt');
	console.log('history server load');
	console.log('token: ', token);
	return {
		token
	};
};
