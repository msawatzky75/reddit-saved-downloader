/// <reference types="@sveltejs/kit" />

declare namespace App {
	interface Locals {}

	interface Platform {}

	interface PrivateEnv {
		REDDIT_CLIENT_ID: string;
	}

	interface PublicEnv {}

	interface Session {}

	interface Stuff {}

	interface Response {
		access_token: string;
		token_type: string;
		expires_in: number;
		scope: string;
		refresh_token: string;
	}
}
