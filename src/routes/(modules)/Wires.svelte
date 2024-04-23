<script lang="ts">
    import totalStrikes from "$lib/stores/strikes"
    import { createEventDispatcher, onDestroy } from "svelte"
    import { correctWireID, wireQuote } from "$lib/stores/gameParams"
    import totalSolvedModules from "$lib/stores/solvedModules"
    const dispatch = createEventDispatcher()
    let strikes: number = 0
    let solvedModules: number = 0
    let disabled: boolean = false
    const totalStrikesUnsubscriber = totalStrikes.subscribe((val) => {
        strikes = val
    })
    const totalSolvedModulesUnsubscriber = totalSolvedModules.subscribe((val) => {
        solvedModules = val
    })
    function unsubscriber() {
        totalStrikesUnsubscriber()
        totalSolvedModulesUnsubscriber()
    }

    function addStrike() {
        totalStrikes.update((n) => n + 1)
        dispatch("strike")
    }

    function validateWire(wireNumber: number) {
        if (wireNumber == correctWireID) {
            console.log("Wire Solved")
            disabled = true
            totalSolvedModules.update((n) => n + 1)
            dispatch("solved")
        } else {
            addStrike()
        }
    }

    onDestroy(unsubscriber)
</script>

<div class={"flex flex-col gap-2"}>
    <button class="px-5 bg-yellow-300" on:click={() => validateWire(1)} {disabled}>1</button>
    <button class="px-5 bg-red-300" on:click={() => validateWire(2)} {disabled}>2</button>
    <button class="px-5 bg-green-300" on:click={() => validateWire(3)} {disabled}>3</button>
    <button class="px-5 bg-slate-300" on:click={() => validateWire(4)} {disabled}>4</button>
    <button class="px-5 bg-yellow-300" on:click={() => validateWire(5)} {disabled}>5</button>
    <button class="px-5 bg-blue-300" on:click={() => validateWire(6)} {disabled}>6</button>
    {#if disabled}
        <div class={"bg-green-400"}>Success!</div>
    {:else}
        <div class={"bg-red-400"}>Not Solved</div>
    {/if}
    <h2 class="text-xl">Thesis:</h2>
    <p class="text-sm">{wireQuote}</p>
</div>
