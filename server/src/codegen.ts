// codegen.ts
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/app/modules/**/*.gql", // scan all .gql files
  generates: {
    "./src/app/graphql/types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "../types/graphql#IResolverContext",
        avoidOptionals: true,
        useIndexSignature: true,
        maybeValue: "T | null",
      },
    },
  },
  hooks: {
    afterAllFileWrite: ["npx prettier --write"],
  },
};

export default config;
