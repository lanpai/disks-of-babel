import { encode, decode } from "../utils/encoding";
import { readFileSync } from "fs";

const path = process.argv[2];

if (!path) {
  console.log("Please provide a path to a file");
  process.exit(1);
}

const data = readFileSync(path);
const encodedData = encode(data);
console.log(encodedData);

(async () => {
  try {
    await WebAssembly.compile(data);
    await WebAssembly.compile(decode(encodedData));
  } catch (e) {
    console.error("Failed to compile WebAssembly module", e);
  }
})();

export {}
