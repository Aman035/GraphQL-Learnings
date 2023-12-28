import { GraphQLClient, gql } from 'graphql-request'

const client = new GraphQLClient('http://localhost:3000/graphql')

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
  const { jobs } = await client.request(query)
  return jobs
}

/**
 * GraphQL query with args
 */
export const getJob = async (id) => {
  const query = gql`
    query JobById($id: ID!) {
      job(id: $id) {
        title
        date
        description
        company {
          id
          name
        }
      }
    }
  `
  const { job } = await client.request(query, { id })
  return job
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
  const { company } = await client.request(query, { id })
  return company
}
