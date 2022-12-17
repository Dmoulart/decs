import {SparseSet} from "./sparse-set";

export const WORLD_MAX_SIZE = 100_000

export type World = ReturnType<typeof createWorld>

export const createWorld = (maxSize = WORLD_MAX_SIZE) => {
    const sset = SparseSet()
    return {
        has: sset.has,
        remove: sset.remove,
        count: sset.count,
        sset,
        maxSize,
    }
}