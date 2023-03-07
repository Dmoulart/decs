import Worker from "web-worker";
// import Worker from ''

const isNode = Boolean(globalThis.process?.versions?.node);

// TODO: Remove this when targeting Node.js 18 (`Blob` global is supported) and if https://github.com/developit/web-worker/issues/30 is fixed.
const makeDataUrl = (content: any) => {
  const data = globalThis.Buffer.from(content).toString("base64");
  return `data:text/javascript;base64,${data}`;
};

function createWorker(content: any, data: any) {
  let worker: any;

  if (isNode) {
    worker = new Worker(makeDataUrl(content), {
      workerData: data,
      type: "module",
    });
  } else {
  }

  return worker;
}

const makeContent = (function_: any) =>
  `
    import {parentPort, workerData} from "node:worker_threads";

		try {
      console.log({workerData});
      // const [timer, args] = workerData;

      console.log("make worker is working !");

      const ctx = {
        $onUpdate: (fn) => $onUpdate(timer, fn),
      };

			(${function_.toString()})(ctx, args);

      parentPort.postMessage("ready");

		} catch (error) {
      console.log(error)
			globalThis.postMessage({error});
		}

	`;

export function makeWorker(function_: any, data: any): Worker {
  const content = makeContent(function_);

  console.log(content);

  return createWorker(content, data);
}
