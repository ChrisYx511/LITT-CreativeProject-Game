import { writable, type Writable } from "svelte/store"
const totalStrikes: Writable<number> = writable(0)
export default totalStrikes
