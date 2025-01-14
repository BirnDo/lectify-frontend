<script lang="ts">
	import { getToastStore, Toast, type ToastSettings } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	let username: string = '';
	let password: string = '';
	let loading: boolean = false;
	let loggedIn: boolean = false;
	let error: string = '';

	const getCookie = (name: string) => {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) {
			const part = parts.pop();
			if (part) return part.split(';').shift();
		}
	};
	const token = getCookie('token');
	console.log(token);

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
		const jwt = 'your-jwt-token';
		document.cookie = `token=${jwt}; path=/; SameSite=Strict; Secure;`;
		loading = true;
		error = '';

		try {
			const response = await fetch('https://your-flask-backend.com/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, password }),
				credentials: 'include' // Include cookies in the request
			});

			const data = await response.json();

			if (response.ok) {
				console.log(data);
				document.cookie = `token=${data.jwt}; path=/; SameSite=Strict; Secure;`;
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
</script>

<div class="container mx-auto p-6 space-y-6">
	<h1 class="text-3xl text-center font-semibold">Account</h1>
	<form class="bg-white shadow-lg rounded-lg mx-auto p-6 space-y-6 w-fit" on:submit={handleLogin}>
		{#if loggedIn}
			<div class="text-center">
				<h2 class="text-xl font-semibold">You are logged in!</h2>
				<button class="btn variant-filled px-6 py-2" on:click={() => (loggedIn = false)}>
					Logout
				</button>
			</div>
		{:else}
			<label class="flex flex-col items-center">
				<span class="mb-2 text-gray-700">Username</span>
				<input
					class="input p-2 pl-4 w-60 sm:w-72 text-center"
					type="text"
					bind:value={username}
					placeholder="Enter your username"
				/>
			</label>

			<label class="flex flex-col items-center">
				<span class="mb-2 text-gray-700">Password</span>
				<input
					class="input p-2 pl-4 w-60 sm:w-72 text-center"
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
