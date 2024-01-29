import { gql } from '@apollo/client'

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
