import Benchmark from 'benchmark'
import {SparseSet} from "../src/sparse-set";

const suite = new Benchmark.Suite("SparseSet")

const sset = SparseSet()

suite.add(
        'Insert 100_000 number', () => {
            for(let i = 0; i <= 100; i++){
                sset.insert(i)
            }
        }
).run()

