import { gql } from '@apollo/client'
import { getJobById, jobDetail } from './queries'
import { client } from './client'

export const createJob = async (title, description) => {
  const mutation = gql`
    mutation createJob($input: CreateJobInput!) {
      # alias so that response is given out as data.job rather than data.createJob
      job: createJob(input: $input) {
        ...JobFragment
      }
    }
    ${jobDetail}
  `

  const { data } = await client.mutate({
    mutation,
    variables: { input: { title, description } },
    update: (cache, { data }) => {
      cache.writeQuery({
        query: getJobById,
        variables: { id: data.job.id },
        data,
      })
    },
  })
  return data.job
}
