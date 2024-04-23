<script lang="ts">
    import totalStrikes from "$lib/stores/strikes"
    import { createEventDispatcher, onDestroy, onMount } from "svelte"
    import { timerValue } from "$lib/stores/gameParams"
    import totalSolvedModules from "$lib/stores/solvedModules"
    import timerString from "$lib/stores/timerString"
    // Global Events and Stores Management //
    let strikes: number = 0
    let solvedModules: number
    let timeRemainingInString: string

    const totalStrikesUnsubscriber = totalStrikes.subscribe((val) => {
        strikes = val
    })
    const totalSolvedModulesUnsubscriber = totalSolvedModules.subscribe((val) => {
        solvedModules = val
    })
    const timerStringUnsubscriber = timerString.subscribe((val) => {
        timeRemainingInString = val
    })
    const dispatch = createEventDispatcher()

    // Lifecycle Management //
    onMount(() => {
        handleStartTimer()
    })
    onDestroy(() => {
        totalStrikesUnsubscriber()
        totalSolvedModulesUnsubscriber()
        timerStringUnsubscriber()
        clearInterval(interval)
    })

    // Control Variables //
    let timerOver = false
    let timerStarted: boolean = false
    let now: number = Date.now()
    let endTime: number = Date.now()
    let remainingTime: number
    $: remainingTime = Math.floor((endTime - now) / 1000)

    // Minutes and Seconds Breakdown //
    let min: number
    let sec: number
    $: min = Math.floor(remainingTime / 60)
    $: sec = Math.floor(remainingTime - min * 60)

    // Helper Functions //
    function padStrings(val: number): string {
        if (val < 10) {
            return "0" + val
        }
        return val.toString()
    }

    function updateTimer() {
        now = Date.now()
    }

    // Timer Start and Stop //
    let interval: number
    $: if (remainingTime <= 0) {
        clearInterval(interval)
        if (timerStarted) {
            timerOver = true
            console.log("Timer Over")
        }
    }

    function handleStartTimer() {
        interval = setInterval(updateTimer, 1000)
        now = Date.now()
        endTime = Date.now() + timerValue * 1000
        timerStarted = true
    }

    // Sync Timer State with External Factors //
    $: {
        timerString.set(`${min}:${sec}`)
    }

    $: if (timerOver)
        dispatch("message", {
            gameOver: true
        })
</script>

<div class="text-center absolute left-0 right-0 m-auto top-[150px]">
    <div class="text-4xl">{padStrings(min)}:{padStrings(sec)}</div>
</div>
