# NOTES

#### **What is GraphQL?**

- GraphQL is a query language for APIs, designed for more efficient and flexible data retrieval.

#### **Problems that GraphQL Solves Over REST-API**

- **Overfetching**: Prevents downloading unnecessary data, unlike REST where clients may receive more data than needed.
- **Underfetching**: Eliminates the need for multiple API calls to gather all required data, a common issue with REST.
- **Type System**: GraphQL's type-first approach allows for clear specification of data requirements and types, rather than relying on server to send the correct data.

#### **Commenting In GraphQL**

- Simple Comments can be added with the `#` symbol
- To add a description to a type, add a triple quote block above the type definition.

  ```graphql
  type Query {
    # Specify that array cannot be null and array elements cannot be null
    """
    Published Jobs on Job Board
    """
    jobs: [Job!]!
  }
  ```

#### **GraphQL Types**

- GraphQL types can be null by default. To make them required, add an exclamation mark after the type name.
  ```graphql
  title: String!
  ```
- [Scalar Types In GraphQL](https://graphql.org/learn/schema/#scalar-types)

#### **Overriding Default Resolvers**

- Direct resolvers override the default resolver for a field. ( Check resolver for `Job.date` )
- Direct Resolvers also resolve a field not specified by default resolver. ( Check resolver for `Job.date` )

  ```typescript
  export const resolvers = {
    // Assumption, returned Job contains title, desc, createdAt
    Query: {
      job: async (_root: any, { id }: { id: string }) => {
        const job = await getJob(id)
        if (!job) {
          notFoundError(`No job found with id: ${id}`)
        }
        return job
      },
    },
    Job: {
      // Overriding default resolver for date field
      title: async (job: Job) => job.title + '!!!',
      // Creating resolver for date field
      date: async (job: Job) => toIsoDate(job.createdAt),
    },
  }
  ```

#### **Error Handling**

- GraphQL has built in error handling. If a field is not found or a null value in found for a non-nullable, it will return an error message with the field name.
- [Build In Errors Codes In GraphQL](https://www.apollographql.com/docs/apollo-server/data/errors/#built-in-error-codes)
- [Custom Errors can be thrown in GraphQL resolvers.](https://www.apollographql.com/docs/apollo-server/data/errors/#custom-errors)

#### **Recursive Queries**

- GraphQL as the name suggests has built in recursive queries.
- A good example where this would be beneficial would be fetching friends of friends to show suggestions on a social app.
- Example - the query for `Company.jobs` will be executed first, then the query for `Job.company` will be executed for each job returned by the first query

  ```graphql
  # schema

  type Query {
    job(id: ID!): Job
    company(id: ID!): Company
  }

  type Job {
    id: ID!
    title: String!
    date: String!
    description: String
    company: Company!
  }

  type Company {
    id: ID!
    name: String!
    description: String
    jobs: [Job!]!
  }
  ```

  ```graphql
  # query to server
  query {
    company(id: "1") {
      id
      name
      jobs {
        id
        title
        company {
          id
          name
        }
      }
    }
  }
  ```
