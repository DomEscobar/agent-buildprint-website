import { runEvalSuite } from "./eval.js";

const result = runEvalSuite();
console.log(JSON.stringify(result, null, 2));
process.exitCode = result.failed === 0 ? 0 : 1;
