<script lang="ts">
    import { buttonText, buttonThesis, keypadSequence } from "$lib/stores/gameParams"
    import totalStrikes from "$lib/stores/strikes"
    import { createEventDispatcher, onDestroy } from "svelte"
    import { buttonReleaseValue } from "$lib/stores/gameParams"
    import totalSolvedModules from "$lib/stores/solvedModules"
    import timerString from "$lib/stores/timerString"
    const dispatch = createEventDispatcher()
    let strikes: number
    let solved: boolean = false
    let solvedModules: number
    let timeRemainingString: string = "00:04:00"

    const totalStrikesUnsubscriber = totalStrikes.subscribe((val) => {
        strikes = val
    })
    const totalSolvedModulesUnsubscriber = totalSolvedModules.subscribe((val) => {
        solvedModules = val
    })

    const timerStringUnsubscriber = timerString.subscribe((val) => {
        timeRemainingString = val
    })
    function addStrike() {
        totalStrikes.update((n) => n + 1)
        dispatch("strike")
    }

    onDestroy(() => {
        totalSolvedModulesUnsubscriber()
        totalStrikesUnsubscriber()
        timerStringUnsubscriber()
    })

    function handleButtonRelease(timeStampClicked: number) {
        // Code based on releasing on timer amount goes here
        for (let i = 0; i < timeRemainingString.length; i++) {
            if (timeRemainingString[i] == buttonReleaseValue) {
                solved = true
                totalSolvedModules.update((n) => n + 1)
                dispatch("solved")
                return
            }
        }
        addStrike()
    }
    let mouseDownTime: number
</script>

<div class="grid grid-cols-1 gap-2">
    <button
        on:mousedown={() => {
            mouseDownTime = Date.now()
        }}
        on:mouseup={() => {
            handleButtonRelease(mouseDownTime)
        }}
        disabled={solved}
        class="bg-slate-400 p-6 hover:bg-slate-600">{buttonText}</button
    >
    {#if solved}
        <div class={"bg-green-400"}>Success!</div>
    {:else}
        <div class={"bg-red-400"}>Not Solved</div>
    {/if}
    <h2 class="text-xl">Quote:</h2>
    <p>{buttonThesis}</p>
</div>
