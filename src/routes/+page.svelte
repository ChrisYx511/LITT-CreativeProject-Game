<script lang="ts">
    import Timer from "./(modules)/Timer.svelte"
    import totalStrikes from "$lib/stores/strikes"
    import { onDestroy, onMount } from "svelte"
    import Button from "./(modules)/Button.svelte"
    import Wires from "./(modules)/Wires.svelte"
    import Keypad from "./(modules)/Keypad.svelte"
    import totalSolvedModules from "$lib/stores/solvedModules"
    import timerString from "$lib/stores/timerString"
    import Strikes from "./Strikes.svelte"
    import type { Unsubscriber } from "svelte/store"

    let strikes: number = 0
    let solvedModules: number
    let timerVal: string
    let gameOver: boolean = false
    let gameOverType: "win" | "lose" | "" = ""
    let gameStarted: boolean = false
    let buzzerSound: HTMLAudioElement
    let dingSound: HTMLAudioElement
    let explosionSound: HTMLAudioElement
    let totalStrikesUnsubscriber: Unsubscriber
    let totalSolvedModulesUnsubscriber: Unsubscriber
    let timerStringUnsubscriber: Unsubscriber
    totalStrikesUnsubscriber = totalStrikes.subscribe((val) => {
        strikes = val
    })
    totalSolvedModulesUnsubscriber = totalSolvedModules.subscribe((val) => {
        solvedModules = val
    })
    timerStringUnsubscriber = timerString.subscribe((val) => {
        timerVal = val
    })

    onDestroy(() => {
        totalSolvedModulesUnsubscriber()
        totalStrikesUnsubscriber()
        timerStringUnsubscriber()
    })

    $: if (strikes >= 3) {
        gameOver = true
        gameOverType = "lose"
        playSound(explosionSound)
    }
    $: if (solvedModules >= 3 && strikes < 3) {
        gameOver = true
        gameOverType = "win"
        playSound(dingSound)
    }
    function handleTimerLapsed() {
        gameOver = true
        gameOverType = "lose"
        playSound(explosionSound)
    }
    function playSound(sound: HTMLAudioElement) {
        sound.currentTime = 0
        sound.play()
    }
</script>

<main>
    {#if !gameStarted}
        <div id="gameContainerPreGame" class="gameContainer mt-4 bg-black text-white">
            <div class=" text-center m-10 text-xl">
                <h1 class="text-4xl">Keep Reading and Nobody Explodes</h1>
                <h2 class="text-2xl">Inspired by the Steel Crate Games party game.</h2>
                <br />
                <p>This screen is for your eyes only.</p>
                <p>You are not allowed to look at the bomb defusal manual.</p>
                <br />
                <p>
                    “Welcome to the dangerous and challenging world of bomb defusing. Study this
                    manual carefully; you are the expert. In these pages you will find everything
                    you need to know to defuse even the most insidious of bombs. And remember — One
                    small oversight and it could all be over!”
                </p>
                <p>Good luck!</p>
                <br />
                <button
                    on:click={() => (gameStarted = true)}
                    class="bg-slate-400 hover:bg-slate-600 p-4 rounded">Start Game</button
                >
            </div>
        </div>
    {/if}
    {#if !gameOver && gameStarted}
        <div id="gameContainerMainGame" class="gameContainer bg-slate-100 mt-8">
            <div class="grid grid-cols-3 grid-rows-2 absolute w-[1276px] h-[716px] gap-2">
                <div
                    class="border-4 border-solid border-slate-800 bg-slate-200 rounded-lg p-2 relative"
                >
                    <Timer
                        on:message={() => {
                            handleTimerLapsed()
                        }}
                    ></Timer>
                </div>
                <div class="border-4 border-solid border-slate-800 bg-slate-200 rounded-lg p-2">
                    <Strikes {strikes}></Strikes>
                </div>

                <div class="border-4 border-solid border-slate-800 bg-slate-200 rounded-lg p-2">
                    <Wires
                        on:strike={() => {
                            playSound(buzzerSound)
                        }}
                        on:solved={() => {
                            playSound(dingSound)
                        }}
                    ></Wires>
                </div>

                <div class="border-4 border-solid border-slate-800 bg-slate-200 rounded-lg p-2">
                    <Keypad
                        on:strike={() => {
                            playSound(buzzerSound)
                        }}
                        on:solved={() => {
                            playSound(dingSound)
                        }}
                    ></Keypad>
                </div>

                <div class="border-4 border-solid border-slate-800 bg-slate-200 rounded-lg p-2">
                    <Button
                        on:strike={() => {
                            playSound(buzzerSound)
                        }}
                        on:solved={() => {
                            playSound(dingSound)
                        }}
                    ></Button>
                </div>
                <div
                    class="border-4 border-solid border-slate-800 bg-slate-200 rounded-lg p-2"
                ></div>
            </div>
        </div>
    {/if}
    {#if gameOverType == "win"}
        <div class="bg-green-400">Success!</div>
    {/if}
    {#if gameOverType == "lose"}
        <div class="bg-red-400">Bomb Exploded</div>
    {/if}
</main>
<audio src="/sound/buzzer.m4a" bind:this={buzzerSound}></audio>
<audio src="/sound/ding.m4a" bind:this={dingSound}></audio>
<audio src="/sound/explosion.m4a" bind:this={explosionSound}></audio>

<style>
    .gameContainer {
        width: 1280px;
        height: 720px;
        position: relative;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        border: 2px solid black;
    }
    main {
        font-family: "Courier Prime", sans-serif;
    }

    #gameContainerMainGame {
        background-image: url(/gameBG.jpg);
        background-size: cover;
        background-repeat: no-repeat;
    }
</style>
