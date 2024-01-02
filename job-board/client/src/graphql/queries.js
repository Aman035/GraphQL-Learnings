import { gql } from '@apollo/client'
import { client } from './client'

export const getJobs = async () => {
  const query = gql`
    {
      jobs {
        id
        title
        date
        company {
          id
          name
        }
      }
    }
  `
  /**
   * By default, Apollo Client will cache the results of queries in memory.
   * Using this fetchPolicy, we are forcing the query to be made to the server
   */
  const { data } = await client.query({ query, fetchPolicy: 'network-only' })
  return data.jobs
}

export const jobDetail = gql`
  fragment JobFragment on Job {
    id
    title
    date
    description
    company {
      id
      name
    }
  }
`
/**
 * GraphQL query with args
 */
export const getJobById = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobFragment
    }
  }
  ${jobDetail}
`

export const getJob = async (id) => {
  const { data } = await client.query({
    query: getJobById,
    variables: { id },
  })
  return data.job
}

export const getCompany = async (id) => {
  const query = gql`
    query companyById($id: ID!) {
      company(id: $id) {
        name
        description
        jobs {
          id
          title
          date
        }
      }
    }
  `
  const { data } = await client.query({ query, variables: { id } })
  return data.company
}
