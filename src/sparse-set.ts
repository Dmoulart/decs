export const SparseSet = () => {
    const dense: number[] = []
    const sparse: number[] = []

    const insert = (num: number) => {
        sparse[num] = dense.push(num) - 1
    }

    const has = (num: number) => !!dense[sparse[num]]

    const remove = (num: number) => {
        if(!has(num)) return

        const last = dense.pop() as number

        if(last == num) return

        const i = sparse[num]
        dense[i] = last
        sparse[last] = i
    }

    const count = () => dense.length

    return {
        insert,
        has,
        count,
        remove,
    }
}