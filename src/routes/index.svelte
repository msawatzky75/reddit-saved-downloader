<script>
	import Button from "$lib/button.svelte";
	import { browser } from "$app/env";
	import { goto } from "$app/navigation";
	import { authorized } from "$lib/utils";

	// if we still have valid auth, go to the download page
	function startup() {
		if (!browser) return;

		const authorization = localStorage.getItem("authorization");
		if (!authorized(authorization)) return goto("/");
		return goto("/download");
	}

	function login() {
		if (!browser) return;

		const CLIENT_ID = "PxG6ZYhAqs4LxAxip3H5NA";
		const REDIRECT_URI = encodeURIComponent("http://localhost:5173/authorize");
		const DURATION = "temporary";
		const SCOPE = "identity,history";
		const RESPONSE_TYPE = "code";

		let STATE = window.localStorage.getItem("state");
		if (!STATE) {
			STATE = Math.random().toString(36).substring(2, 15).toUpperCase();
		}
		window.localStorage.setItem("state", STATE);

		let url = `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&state=${STATE}&redirect_uri=${REDIRECT_URI}&duration=${DURATION}&scope=${SCOPE}`;

		return goto(url);
	}

	startup();
</script>

<svelte:head>
	<title>Reddit Downloader</title>
</svelte:head>

<div class="container m-auto">
	<h1 class="text-xl text-center">Login</h1>

	<div class="flex mt-4">
		<div class="grow" />
		<Button on:click={login}>Login</Button>
		<div class="grow" />
	</div>
</div>
