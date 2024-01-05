import { gql } from '@apollo/client'
import { jobDetail } from './fragments'

export const getJobsQuery = gql`
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

export const getJobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobFragment
    }
  }
  ${jobDetail}
`

export const getCompanyByIdQuery = gql`
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
`
