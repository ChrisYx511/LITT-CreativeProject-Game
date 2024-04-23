<script lang="ts">
    export let strikes: number
    let strikeStr: string
    $: strikeStr = "X ".repeat(strikes)
</script>

<div class="flex flex-col text-center">
    <h2 class="text-4xl">Strikes</h2>
    <h2 class="text-4xl text-red-600">
        {strikeStr}
    </h2>
</div>
