import chalk from 'chalk';

export const run = (name: string, fn: Function) => {
    chalk.blue.underline(`Running ${name}`)
    const start = performance.now()
    try{
        fn()
    } catch(err) {
         chalk.red.bold(`Error ${err}`)
    }
    const end = performance.now()
    chalk.green.bold(`Done in ${end - start}ms`)
}