import { writable, type Writable } from "svelte/store"

const totalSolvedModules: Writable<number> = writable(0)

export default totalSolvedModules
