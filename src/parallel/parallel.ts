// import makeAsynchronous from "make-asynchronous";

export const parallel = (fn: (...args: any) => void) => {};

// import {isNode} from "./runtimes";

// // worker = new Worker(makeDataUrl(content), { type: "module" });
// const makeBlob = (content: any) =>
//   new globalThis.Blob([content], {type: "text/javascript"});

// const makeDataUrl = (content: any) => {
//   const data = globalThis.Buffer.from(content).toString();
//   return `data:text/javascript;${data}`;
// };

// const makeContent = (fn: (...args: any[]) => void) => {
//   return `
// 	globalThis.onmessage = async ({data: arguments_}) => {
// 		try {
// 			const output = await (${fn.toString()})(...arguments_);
// 			globalThis.postMessage({output});
// 		} catch (error) {
// 			globalThis.postMessage({error});
// 		}
// 	};
// 	`;
// };

// export const parallel = (fn: (...args: any[]) => void) => {
//   let url: string;
//   let worker: Worker;
//   const content = makeContent(fn);

//   const cleanup = () => {
//     if (url) {
//       URL.revokeObjectURL(url);
//     }

//     worker?.terminate();
//   };

//   if (isNode) {
//     const {Worker} = require("worker_threads");
//     worker = new Worker(makeDataUrl(content), {type: "module"});
//   } else {
//     url = URL.createObjectURL(makeBlob(content));
//     worker = new Worker(url, {type: "module"});
//   }
//   return [
//     (...args: any[]) => {
//       worker.postMessage(args);
//     },
//     cleanup,
//   ];

//   //   return {
//   //     worker,
//   //     cleanup,
//   //   };
// };
