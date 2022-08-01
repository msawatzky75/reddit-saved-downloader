export { matchers } from './client-matchers.js';

export const components = [
	() => import("../../src/routes/__layout.svelte"),
	() => import("../runtime/components/error.svelte"),
	() => import("../../src/routes/authorize.svelte"),
	() => import("../../src/routes/download.svelte"),
	() => import("../../src/routes/index.svelte")
];

export const dictionary = {
	"": [[0, 4], [1]],
	"authorize": [[0, 2], [1]],
	"download": [[0, 3], [1]]
};