<script lang="ts">
	let count: number = 0;
	const increment = () => {
		count += 1;
	};
</script>

<button on:click={increment} class="border p-1 rounded border-black">
	count is {count}
</button>
