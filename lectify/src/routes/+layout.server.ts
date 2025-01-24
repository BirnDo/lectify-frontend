import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const token = cookies.get('jwt');
	console.log('layout server load');
	console.log(token);
	return {
		token
	};
};
