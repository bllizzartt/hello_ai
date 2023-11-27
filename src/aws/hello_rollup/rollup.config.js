import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "./index.js",
  output: {
    dir: "out",
    format: "es",
  },
  plugins: [nodeResolve()],
};
