<script lang="ts">
	import { browser } from "$app/env";
	import { goto } from "$app/navigation";
	import { authorized } from "$lib/utils";

	function startup() {
		if (!browser) return goto("/");

		const authorization = localStorage.getItem("authorization");
		if (!authorized(authorization)) {
			localStorage.removeItem("authorization");
			return goto("/");
		}

		return goto("/download");
	}

	$: if (browser) startup();
</script>

the download page
