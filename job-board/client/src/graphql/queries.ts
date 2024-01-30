import { gql } from '../__generated__'

export const getJobsQuery = gql(/* GraphQL */ `
  query getJobs($page: Int = 1, $limit: Int = 10) {
    jobs(page: $page, limit: $limit) {
      items {
        id
        title
        date
        company {
          id
          name
        }
      }
      totalCount
    }
  }
`)

export const getJobByIdQuery = gql(/* GraphQL */ `
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobFragment
    }
  }
`)

export const getCompanyByIdQuery = gql(/* GraphQL */ `
  query CompanyById($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        title
        date
      }
    }
  }
`)
