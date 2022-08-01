import type { TokenResponse } from "src/routes/token";

export function authorized(authorization: string): boolean {
	if (!authorization) {
		return false;
	}

	let expires: number;
	try {
		expires = (JSON.parse(authorization) as TokenResponse).expires;
	} catch (e) {
		return false;
	}

	if (!expires) {
		return false;
	}

	if (expires < new Date().getTime()) {
		localStorage.removeItem("authorization");
		return false;
	}

	return true;
}
