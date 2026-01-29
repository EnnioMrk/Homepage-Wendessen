import coreWebVitalsConfig from "eslint-config-next/core-web-vitals";
import typescriptConfig from "eslint-config-next/typescript";

const eslintConfig = [
  ...coreWebVitalsConfig,
  ...typescriptConfig,
  {
    ignores: [
      "node_modules/",
      ".next/",
      "out/",
      "public/sw.js",
      "scripts/",
      "tests/",
      "types/",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
