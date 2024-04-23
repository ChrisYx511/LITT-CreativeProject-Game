<script lang="ts">
    import { keypadQuote, keypadSequence } from "$lib/stores/gameParams"
    import totalSolvedModules from "$lib/stores/solvedModules"
    import totalStrikes from "$lib/stores/strikes"
    import { createEventDispatcher, onDestroy } from "svelte"
    const dispatch = createEventDispatcher()
    let strikes: number
    let solved: boolean = false
    let solvedModules: number
    const totalStrikesUnsubscriber = totalStrikes.subscribe((val) => {
        strikes = val
    })
    const totalSolvedModulesUnsubscriber = totalSolvedModules.subscribe((val) => {
        solvedModules = val
    })
    function addStrike() {
        totalStrikes.update((n) => n + 1)
        dispatch("strike")
    }

    let pressedSequence: number[] = []

    function addToSequence(id: number) {
        pressedSequence = [...pressedSequence, id]
        console.log(pressedSequence)
        switch (id) {
            case 0:
                button1Disabled = true
                break
            case 1:
                button2Disabled = true
                break
            case 2:
                button3Disabled = true
                break
            case 3:
                button4Disabled = true
                break
        }
    }

    function validateSequence() {
        console.log(pressedSequence)
        console.log(keypadSequence)
        for (let i: number = 0; i < 4; i++) {
            if (pressedSequence[i] !== keypadSequence[i]) {
                addStrike()
                pressedSequence = []
                button1Disabled = false
                button2Disabled = false
                button3Disabled = false
                button4Disabled = false
                return
            }
        }
        solved = true
        console.log("Solved!")
        button1Disabled = true
        button2Disabled = true
        button3Disabled = true
        button4Disabled = true
        totalSolvedModules.update((n) => n + 1)
        dispatch("solved")
    }
    $: if (pressedSequence.length >= 4) validateSequence()
    let button1Disabled: boolean = false
    let button2Disabled: boolean = false
    let button3Disabled: boolean = false
    let button4Disabled: boolean = false

    onDestroy(() => {
        totalStrikesUnsubscriber()
        totalSolvedModulesUnsubscriber()
    })
</script>

<div class="grid grid-cols-2 grid-rows-2 gap-2">
    <button
        class="p-4 rounded shadow-md bg-slate-300 hover:bg-slate-500"
        disabled={button1Disabled}
        on:click={() => addToSequence(0)}>1</button
    >
    <button
        class="p-4 rounded shadow-md bg-slate-300 hover:bg-slate-500"
        disabled={button2Disabled}
        on:click={() => addToSequence(1)}>2</button
    >
    <button
        class="p-4 rounded shadow-md bg-slate-300 hover:bg-slate-500"
        disabled={button3Disabled}
        on:click={() => addToSequence(2)}>3</button
    >
    <button
        class="p-4 rounded shadow-md bg-slate-300 hover:bg-slate-500"
        disabled={button4Disabled}
        on:click={() => addToSequence(3)}>4</button
    >
    {#if solved}
        <div class={"bg-green-400 col-span-2"}>Success!</div>
    {:else}
        <div class={"bg-red-400 col-span-2"}>Not Solved</div>
    {/if}
    <h2 class="text-xl col-span-2">Quote:</h2>
    <p class="col-span-2 text-sm">{keypadQuote}</p>
</div>
