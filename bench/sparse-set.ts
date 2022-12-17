// This create V8 error SIGTRAP. Why ?
import {SparseSet} from "../src/sparse-set";
import Benchmark from 'benchmark'

const suite = new Benchmark.Suite("SparseSet")

const sset = SparseSet()

suite.add('Insert 100_000 number', () => sset.insert(1)).run()

