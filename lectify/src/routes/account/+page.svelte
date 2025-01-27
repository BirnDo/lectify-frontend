<script lang="ts">
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
	export let data;
	const toastStore = getToastStore();

	let username: string = data.user?.username;
	let password: string = '';
	let confirmPassword: string = '';
	let loading: boolean = false;
	let error: string = '';
	let loggedIn: boolean = false;
	let isRegistering: boolean = false;

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
				loggedIn = true;
				toastStore.trigger({
					message: 'Login successful!',
					timeout: 3000,
					background: 'variant-filled-success'
				} as ToastSettings);
				password = '';
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
			username = '';
			password = '';
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

	async function handleRegister() {
		if (!username || !password || !confirmPassword) {
			toastStore.trigger({
				message: 'Please fill in all fields.',
				background: 'variant-filled-error'
			});
			return;
		}

		if (password !== confirmPassword) {
			toastStore.trigger({
				message: 'Passwords do not match.',
				background: 'variant-filled-error'
			});
			return;
		}

		loading = true;
		error = '';

		try {
			const response = await fetch(API_ENDPOINT + '/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, password })
			});

			const data = await response.json();

			if (response.ok) {
				const loginResponse = await fetch(API_ENDPOINT + '/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include',
					body: JSON.stringify({ username, password })
				});

				if (loginResponse.ok) {
					loggedIn = true;
					toastStore.trigger({
						message: 'Registration successful! You are now logged in.',
						background: 'variant-filled-success'
					});
				} else {
					toastStore.trigger({
						message: 'Registration successful! Login failed!.',
						background: 'variant-filled-error'
					});
				}
			} else {
				error = data.message || 'Registration failed.';
				toastStore.trigger({
					message: error,
					background: 'variant-filled-error'
				});
			}
		} catch (err) {
			console.error('Registration failed:', err);
			toastStore.trigger({
				message: 'An unexpected error occurred.',
				background: 'variant-filled-error'
			});
		} finally {
			loading = false;
		}
	}
</script>

<div class="container mx-auto p-6 space-y-6">
	{#if loggedIn}
		<form
			class="bg-white dark:bg-surface-800 shadow-xl rounded-xl mx-auto p-8 space-y-6 w-fit max-w-md"
		>
			<div class="text-center">
				<h2 class="text-xl font-semibold">
					{#if new Date().getHours() < 12}
						Good morning
					{:else if new Date().getHours() < 18}
						Good afternoon
					{:else}
						Good evening
					{/if}{username}!
				</h2>
				<button class="btn variant-filled px-6 py-2 mt-4" type="button" on:click={handleLogout}>
					Log out
				</button>
			</div>
		</form>
	{:else}
		<form
			class="bg-white dark:bg-surface-800 shadow-xl rounded-xl mx-auto p-8 space-y-8 w-fit max-w-md"
			on:submit={isRegistering ? handleRegister : handleLogin}
		>
			<h2 class="text-2xl font-semibold text-center mb-2">
				{isRegistering ? 'Create a new account' : 'Log into existing account'}
			</h2>

			<div class="space-y-6">
				<label class="flex flex-col items-center space-y-2">
					<span class="font-medium">Username</span>
					<input
						class="input w-full sm:w-80 text-center"
						type="text"
						bind:value={username}
						placeholder="Enter your username"
					/>
				</label>

				<label class="flex flex-col items-center space-y-2">
					<span class="font-medium">Password</span>
					<input
						class="input w-full sm:w-80 text-center"
						type="password"
						bind:value={password}
						placeholder="Enter your password"
					/>
				</label>

				{#if isRegistering}
					<label class="flex flex-col items-center space-y-2">
						<span class="font-medium">Confirm Password</span>
						<input
							class="input w-full sm:w-80 text-center"
							type="password"
							bind:value={confirmPassword}
							placeholder="Confirm your password"
						/>
					</label>
				{/if}
			</div>

			<div class="flex flex-col items-center gap-6">
				<button
					class="btn variant-filled px-8 py-3 w-48 font-medium text-base"
					type="submit"
					disabled={loading}
				>
					{#if loading}
						Loading...
					{:else}
						{isRegistering ? 'Register' : 'Log in'}
					{/if}
				</button>

				<button
					type="button"
					class="text-sm text-primary-500 hover:underline font-medium"
					on:click={() => {
						isRegistering = !isRegistering;
						username = '';
						password = '';
						confirmPassword = '';
					}}
				>
					{isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
				</button>
			</div>
		</form>
	{/if}
</div>
