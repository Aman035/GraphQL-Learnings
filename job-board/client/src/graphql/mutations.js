import { GraphQLClient, gql } from 'graphql-request'
import { getAccessToken } from '../lib/auth'
const client = new GraphQLClient('http://localhost:3000/graphql', {
  headers: () => {
    const token = getAccessToken()
    if (token) {
      return {
        authorization: `Bearer ${token}`,
      }
    } else {
      return {}
    }
  },
})

export const createJob = async (title, description) => {
  const mutation = gql`
    mutation createJob($input: CreateJobInput!) {
      # alias so that response is given out as data.job rather than data.createJob
      job: createJob(input: $input) {
        id
      }
    }
  `
  const { job } = await client.request(mutation, {
    input: { title, description },
  })
  return job
}
