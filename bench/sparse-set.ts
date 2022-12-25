import {SparseSet} from "../src/collections/sparse-set.js";
import {run} from "./run/runner.js";

// INSERT method
// ----------------------

const sset = SparseSet()
const set = new Set()

run('Sparse Set: Insert 100_000 number', () => {
    for(let i = 0; i <= 100_000; i++){
        sset.insert(i)
    }
})

run('Standard Set: Insert 100_000 number', () => {
    for(let i = 0; i <= 100_000; i++){
        set.add(i)
    }
}, 'blue')

run('Sparse Set: Insert 1_000_000 number', () => {
    for(let i = 0; i <= 1_000_000; i++){
        sset.insert(i)
    }
})

run('Standard Set: Insert 1_000_000 number', () => {
    for(let i = 0; i <= 1_000_000; i++){
        set.add(i)
    }
}, 'blue')

// HAS method
// ----------------------

const sset2 = SparseSet()
for(let i = 0; i <= 100_000; i++){
    sset2.insert(i)
}

const set2 = new Set()
for(let i = 0; i <= 100_000; i++){
    set2.add(i)
}

run('Sparse Set: Has 100_000 times', () => {
    for(let i = 0; i <= 100_000; i++){
        sset2.has(i)
    }
})
run('Set: Has 100_000 times', () => {
    for(let i = 0; i <= 100_000; i++){
        set2.has(i)
    }
}, 'blue')

// HAS method
// ----------------------
const sset3 = SparseSet()
for(let i = 0; i <= 1_000_000; i++){
    sset3.insert(i)
}

const set3 = new Set()
for(let i = 0; i <= 1_000_000; i++){
    set3.add(i)
}

run('Sparse Set: Has 1_000_000 times', () => {
    for(let i = 0; i <= 1_000_000; i++){
        sset3.has(i)
    }
})

run('Set: Has 1_000_000 times', () => {
    for(let i = 0; i <= 1_000_000; i++){
        set3.has(i)
    }
}, 'blue')


// REMOVE method
// ----------------------
const sset4 = SparseSet()
for(let i = 0; i <= 1_000_000; i++){
    sset4.insert(i)
}

const set4 = new Set()
for(let i = 0; i <= 1_000_000; i++){
    set4.add(i)
}

run('Sparse Set: Remove 1_000_000 times', () => {
    for(let i = 0; i <= 1_000_000; i++){
        sset4.remove(i)
    }
})

run('Set: Remove 1_000_000 times', () => {
    for(let i = 0; i <= 1_000_000; i++){
        set4.delete(i)
    }
}, 'blue')

