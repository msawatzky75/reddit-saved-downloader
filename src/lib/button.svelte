<script lang="ts">
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	const onClick: svelte.JSX.MouseEventHandler<HTMLButtonElement> = (e) => {
		dispatch("click", e);
	};

	export let className = "";
	$: _class = `border border-black rounded-md p-1 ${className}`;
</script>

<button class={_class} on:click={onClick}>
	<slot />
</button>
