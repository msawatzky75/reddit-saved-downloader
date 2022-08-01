<script lang="ts">
	import { browser } from "$app/env";
	import { goto } from "$app/navigation";
	import type { TokenResponse } from "./token";

	async function startup() {
		if (!localStorage.getItem("state")) return goto("/");

		const params = new URLSearchParams(window.location.search);

		if (params.has("error")) {
			console.log(params.get("error"));
			return goto("/");
		}

		const state = params.get("state");
		const code = params.get("code");

		if (localStorage.getItem("state") !== state) {
			console.error("State mismatch");
			return goto("/");
		}

		if (!code) {
			console.error("No code");
			return goto("/");
		}

		const response: TokenResponse = await fetch("/token?code=" + code, {
			headers: {
				accept: "application/json",
			},
		}).then((r) => r.json());

		localStorage.setItem("authorization", JSON.stringify(response));
		console.log(response);
		return goto("/download");
	}

	// only run on the browser
	$: if (browser) startup();
</script>
