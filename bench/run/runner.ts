import chalk from "chalk";

const logBenchName = (name: string, color?: string) => {
  const operation = chalk.yellow.underline(`Running`);

  const benchName = color
    ? (chalk as any)[color](name)
    : chalk.magenta.underline(name);

  console.log(operation, benchName);
};
export const run = (name: string, fn: Function, color?: keyof typeof chalk) => {
  logBenchName(name, color);

  const start = performance.now();
  try {
    fn();
  } catch (err) {
    chalk.red.bold(`Error ${err}`);
  }
  const end = performance.now();
  const ms = (end - start).toFixed(3);

  console.log(
    chalk.gray.underline(`${name} Done in `),
    chalk.green.bold(`${ms}ms`)
  );
};

export const runAsync = async (
  name: string,
  fn: (...args: any[]) => Promise<any>,
  color?: keyof typeof chalk
) => {
  logBenchName(name, color);

  const start = performance.now();
  try {
    await fn();
  } catch (err) {
    chalk.red.bold(`Error ${err}`);
  }
  const end = performance.now();
  const ms = (end - start).toFixed(3);

  console.log(
    chalk.gray.underline(`${name} Done in `),
    chalk.green.bold(`${ms}ms`)
  );
};
