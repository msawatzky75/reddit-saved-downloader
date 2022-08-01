import { env } from "$env/dynamic/private";

export interface TokenResponse {
	access_token: string;
	expires: number;
	token_type: string;
	scope: string;
	refresh_token: string;
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export const GET: import("@sveltejs/kit").RequestHandler = async (event) => {
	interface Response {
		access_token: string;
		token_type: string;
		expires_in: number;
		scope: string;
		refresh_token: string;
	}

	// get the authorization token
	const response = await fetch(`https://www.reddit.com/api/v1/access_token`, {
		method: "POST",
		headers: {
			accept: "application/json",
			"Content-Type": "application/x-www-form-urlencoded",
			authorization: `Basic ${Buffer.from(`${env.REDDIT_CLIENT_ID}:`).toString(
				"base64"
			)}`,
		},
		body: new URLSearchParams({
			grant_type: "authorization_code",
			code: event.url.searchParams.get("code"),
			redirect_uri: "http://localhost:5173/authorize",
		}),
	});

	console.log(response);

	if (response.status !== 200) {
		return {
			status: response.status,
			headers: response.headers,
			body: await response.text(),
		};
	}

	const {
		access_token,
		expires_in,
		token_type,
		scope,
		refresh_token,
	}: Response = await response.json();

	return {
		status: 200,
		headers: {
			"access-control-allow-origin": "*",
		},
		body: {
			access_token,
			expires: new Date(new Date().getTime() + expires_in * 1000),
			token_type,
			scope,
			refresh_token,
		},
	};
};
