import { gql } from '@apollo/client'
import { jobDetail } from './fragments'

export const createJobMutation = gql`
  mutation createJob($input: CreateJobInput!) {
    # alias so that response is given out as data.job rather than data.createJob
    job: createJob(input: $input) {
      ...JobFragment
    }
  }
  ${jobDetail}
`
