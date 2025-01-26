<script lang="ts">
	import { getToastStore, Toast, type ToastSettings } from '@skeletonlabs/skeleton';
	const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
	export let data;

	const toastStore = getToastStore();

	let username: string = '';
	let password: string = '';
	let loading: boolean = false;
	let error: string = '';
	let loggedIn = false;
	if (data.token) loggedIn = true;

	async function handleLogin(event: Event) {
		event.preventDefault();
		if (!username || !password) {
			toastStore.trigger({
				message: 'Please enter your username and password.',
				timeout: 3000,
				background: 'variant-filled-error'
			} as ToastSettings);
			return;
		}
		loading = true;
		error = '';

		try {
			const response = await fetch(API_ENDPOINT + '/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify({ username: username, password: password })
			});

			const data = await response.json();

			if (response.ok) {
				console.log(data);
				loggedIn = true;
				toastStore.trigger({
					message: 'Login successful!',
					timeout: 3000,
					background: 'variant-filled-success'
				} as ToastSettings);
			} else {
				error = data.error || 'An error occurred during login.';
				toastStore.trigger({
					message: error,
					timeout: 3000,
					background: 'variant-filled-error'
				} as ToastSettings);
			}
		} catch (err) {
			console.error('Login failed:', err);
			error = 'An unexpected error occurred.';
			toastStore.trigger({
				message: error,
				timeout: 3000,
				background: 'variant-filled-error'
			} as ToastSettings);
		} finally {
			loading = false;
		}
	}
	async function handleLogout() {
		const response = await fetch(API_ENDPOINT + '/logout', {
			method: 'POST',
			credentials: 'include'
		});

		if (response.ok) {
			console.log('Logged out successfully');
			loggedIn = false;
			toastStore.trigger({
				message: 'Logout successful!',
				timeout: 3000,
				background: 'variant-filled-success'
			} as ToastSettings);
		} else {
			console.error('Failed to log out');
			toastStore.trigger({
				message: 'Logout failed!',
				timeout: 3000,
				background: 'variant-filled-failure'
			} as ToastSettings);
			window.location.reload();
		}
	}
</script>

<div class="container mx-auto p-6 space-y-6">
	<h1 class="text-3xl text-center font-semibold">Account</h1>
	<form
		class="bg-white dark:bg-surface-800 shadow-lg rounded-lg mx-auto p-6 space-y-6 w-fit"
		on:submit={handleLogin}
	>
		{#if loggedIn}
			<div class="text-center">
				<h2 class="text-xl font-semibold">You are logged in!</h2>
				<button class="btn variant-filled px-6 py-2 mt-4" type="button" on:click={handleLogout}>
					Logout
				</button>
			</div>
		{:else}
			<label class="flex flex-col items-center">
				<span class="mb-2">Username</span>
				<input
					class="input w-60 sm:w-72 text-center"
					type="text"
					bind:value={username}
					placeholder="Enter your username"
				/>
			</label>

			<label class="flex flex-col items-center">
				<span class="mb-2">Password</span>
				<input
					class="input w-60 sm:w-72 text-center"
					type="password"
					bind:value={password}
					placeholder="Enter your password"
				/>
			</label>

			<div class="flex justify-center">
				<button class="btn variant-filled px-6 py-2" type="submit" disabled={loading}>
					{#if loading}
						Loading...
					{:else}
						Login
					{/if}
				</button>
			</div>
		{/if}
	</form>

	<Toast />
</div>
