# NOTES

#### **What is GraphQL?**

- GraphQL is a query language for APIs, designed for more efficient and flexible data retrieval.

#### **Problems that GraphQL Solves Over REST-API**

- **Overfetching**: Prevents downloading unnecessary data, unlike REST where clients may receive more data than needed.
- **Underfetching**: Eliminates the need for multiple API calls to gather all required data, a common issue with REST.
- **Type System**: GraphQL's type-first approach allows for clear specification of data requirements and types, rather than relying on server to send the correct data.

#### **Is GraphQL a replacement for REST ?**

- GraphQL is not a direct replacement for REST, but rather an alternative approach to building and querying APIs. Each has its strengths and use cases, and they can even coexist in the same application.
- REST still servers as a good choice over graphQL when a lot of data is being fetched and caching is required, as GraphQL can have performqance issues and design complexity in such cases.

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

#### **Passing Arguments in GraphQL Queries**

- GraphQL allows passing static and dynamic arguments

  ```graphql
  # STATIC
  query {
    job(id: "1") {
      name
    }
  }

  # DYNAMIC
  query GetJob($id: ID!) {
    job(id: $id) {
      name
    }
  }

  # Note: Input Variables need to be passed to this dynamic query
  ```

#### **Alias In GraphQL**

- Aliases can be used in GraphQL queries to rename results. This is useful when u request multiple results of same name in the same query
  ```graphql
  {
    job1: job(id: 1) {
      name
    }
    job2: job(id: 2) {
      name
    }
  }
  ```

#### **GraphQL Types**

- GraphQL types can be null by default. To make them required, add an exclamation mark after the type name.
  ```graphql
  title: String!
  ```
- [Scalar Types In GraphQL](https://graphql.org/learn/schema/#scalar-types)

#### **Overriding Default Resolvers**

- Direct resolvers override the default resolver for a field. ( Check resolver for `Job.date` in `job-board` project )
- Direct Resolvers also resolve a field not specified by default resolver. ( Check resolver for `Job.date` `job-board` project )

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

#### **Should Authentication be done in GraphQL or REST?**

- [StackOverFlow Answer](https://stackoverflow.com/questions/77094417/should-i-use-rest-or-graphql-for-the-login#:~:text=Following%20this%20idea%2C%20your%20schema,login%20is%20a%20good%20practice.)
- Although GraphQL can be used for authentication, it does not seems to be a good practice, also shopify ( a big GraphQL user ) does not use GraphQL for authentication.
- `My Take` - Use REST for authentication and then use GraphQL with auth headers for everything else.
- Also GraphQL can be used over HTTP or websocket, whereas authetication is usually done over HTTP. ( Passing auth headers etc are standardised in HTTP rather than as args in GraphQL )

#### **Passing Context to GraphQL Resolvers**

- Context ( Any Custom Information ) can be passed to GraphQL resolvers to share data between resolvers.
- In `job-board` project, the `context` is used to pass the user authentication details to the resolvers.
