<script lang="ts">
	import { browser } from "$app/env";
	import { goto } from "$app/navigation";
	import Button from "$lib/button.svelte";
	import { authorized } from "$lib/utils";
	import type { TokenResponse } from "./token";
	import * as JSZip from "jszip";
	import type { Listing } from "$lib/reddit";

	interface RedditLink {
		url: string;
		post_hint?: string;
		id: string;
		media_metadata?: {}[];
	}

	let loading = { user: false, token: false, saved: false };
	let auth: TokenResponse;

	let user = null;
	let saved = null;
	let imageMap: Record<string, string> = {};
	let errors = [];
	let zip;

	async function startup() {
		if (!browser) return goto("/");

		loading.token = true;
		const authorization = localStorage.getItem("authorization");
		if (!authorized(authorization)) {
			localStorage.removeItem("authorization");
			return goto("/");
		}
		auth = JSON.parse(authorization);
		loading.token = false;

		user = await loadUser(`${auth.token_type} ${auth.access_token}`);

		await loadAllSaved(user.name, `${auth.token_type} ${auth.access_token}`);
	}
	$: if (browser) startup();

	async function loadAllSaved(username: string, token: string) {
		let batch: Awaited<ReturnType<typeof loadSaved>>;

		do {
			batch = await loadSaved({
				username,
				authorization: token,
				limit: 100,
				after: batch?.data.after,
			});

			imageMap = batch.data.children
				.filter((child) => child.data.post_hint === "image")
				.reduce(
					(map, child) => ({
						...map,
						[`${child.data.subreddit}_${child.data.id}`]: child.data.url,
					}),
					imageMap
				);

			imageMap = batch.data.children
				.filter(
					(child) =>
						child.data.post_hint !== "image" && child.data.media_metadata
				)
				.reduce(
					(map, child) => ({
						...map,
						...Object.keys(child.data.media_metadata).reduce(
							(acc, key) => ({
								...acc,
								[`${child.data.subreddit}_${child.data.id}_${key}`]:
									child.data.media_metadata[key].s.u,
							}),
							{}
						),
					}),
					imageMap
				);

			errors = [
				...errors,
				...(batch.data.children as any[]).filter(
					(child) =>
						child.data.post_hint !== "image" && !child.data.media_metadata
				),
			];
			console.log();
		} while (batch?.data.after);
	}

	async function loadUser(authorization: string) {
		if (loading.user) return;
		let user;

		loading.user = true;
		user = await fetch("https://oauth.reddit.com/api/v1/me", {
			headers: {
				accept: "application/json",
				authorization,
			},
		}).then((r) => r.json());
		loading.user = false;

		return user;
	}

	interface LoadSavedOptions {
		username: string;
		authorization: string;
		after?: string;
		count?: number;
		limit?: number;
	}

	async function loadSaved({
		username,
		authorization,
		after,
		count,
		limit,
	}: LoadSavedOptions): Promise<Listing> {
		if (loading.saved) return;

		loading.saved = true;
		const params = new URLSearchParams();
		params.append("limit", limit.toString() || "20");
		params.append("type", "link");
		params.append("raw_json", "1");
		if (after) params.append("after", after);
		if (count) params.append("count", count.toString());

		const saved = await fetch(
			`https://oauth.reddit.com/user/${username}/saved?${params}`,
			{
				headers: {
					accept: "application/json",
					authorization,
				},
			}
		).then((r) => r.json());
		loading.saved = false;

		return saved;
	}

	async function zipImages(map: Record<string, string>) {
		const zipper = new JSZip();
		for (const [id, url] of Object.entries(map)) {
			const image = await fetch(url).then((r) => r.blob());
			zipper.file(`${id}.jpg`, image);
		}

		zip = await zipper.generateAsync({ type: "base64" });
	}

	function logout() {
		localStorage.removeItem("authorization");
		goto("/");
	}
</script>

<div class="container mx-auto">
	<h1 class="text-xl">Download</h1>
	<Button on:click={logout}>Log out</Button>

	{#if !user}
		<div class="loading">
			loading
			<div class="spinner" />
		</div>
	{:else}
		<p>
			You are logged in as <strong>{user.name}</strong>.
		</p>
	{/if}

	{#if imageMap}
		<Button on:click={() => zipImages(imageMap)}
			>Create zip of {Object.keys(imageMap).length} images.</Button
		>
		{#if zip}
			<a href="data:application/zip;base64,{zip}" target="_blank">Download</a>
		{/if}
		{#if errors}
			<pre>{JSON.stringify(errors.length, null, 2)} errors</pre>
			<pre>{JSON.stringify(errors, null, 2)}</pre>
		{/if}
	{/if}
</div>
