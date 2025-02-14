import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, fetch }) => {
	const { token } = data;
	console.log('login page load, ', new Date().toISOString());
	console.log('token: ', token);
	let user = null;
	if (token) {
		try {
			const response = await fetch('/api/user', {
				credentials: 'include'
			});
			if (response.ok) {
				const userData = await response.json();
				user = userData;
			}
		} catch (error) {
			console.error('Failed to fetch user data:', error);
		}
	}

	return {
		token,
		user
	};
};
