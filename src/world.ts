import {SparseSet} from "./sparse-set";

export const WORLD_MAX_SIZE = 100_000

export type World = ReturnType<typeof World>

export const World = (size = WORLD_MAX_SIZE) => {
    let cursor = 0;

    const sset = SparseSet()

    const world = {
        count: sset.count,
        cursor,
        sset,
        size,
    };

    return world
}