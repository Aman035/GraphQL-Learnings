import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: '../server/src/graphql/schema.graphql',
  // this assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
  documents: ['src/graphql/*.{ts,tsx}'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/__generated__/': {
      preset: 'client',
      plugins: [],
      config: {
        skipTypename: true,
      },
      presetConfig: {
        gqlTagName: 'gql',
        // Avoid issues with fragments
        fragmentMasking: false,
      },
    },
  },
}

export default config
