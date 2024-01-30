import { gql } from '../__generated__'

export const createJobMutation = gql(/* GraphQL */ `
  mutation createJob($input: CreateJobInput!) {
    # alias so that response is given out as data.job rather than data.createJob
    job: createJob(input: $input) {
      ...JobFragment
    }
  }
`)
