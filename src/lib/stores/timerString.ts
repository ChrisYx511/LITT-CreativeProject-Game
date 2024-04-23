import { writable, type Writable } from "svelte/store"

const timerString: Writable<string> = writable("00:00:00")

export default timerString
