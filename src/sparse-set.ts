import {WORLD_MAX_SIZE} from "./world";

export const SparseSet = (max = WORLD_MAX_SIZE ) => {
    const dense: number[] = []
    const sparse: number[] = new Array(max + 1)

    const insert = (num: number) => {
        sparse[num] = dense.push(num) - 1
    }

    const has = (num: number) => {
        return !!dense?.[sparse?.[num]]
    }

    const count = () => dense.length



    return {
        insert,
        has,
        count
    }
}