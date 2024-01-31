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
- [Custom Errors can be thrown in GraphQL resolvers](https://www.apollographql.com/docs/apollo-server/data/errors/#custom-errors)

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

#### **Using GraphQL On Client Side**

- Mostly all the graphql queries are just post queries with body containing the query and variables.
- Most simple approach is to use `fetch` or `axios` to make the post request. Although this does not offer any validation checks, caching etc and is not recommended.
- `graphql-request` is a good library for making graphql requests on client side. This library is minimal but does not include inbuilt caching.
- `Apollo Client` is a more advanced library for making graphql requests on client side. This library is feature rich and includes inbuilt caching, validation etc. Refer to `job-board-client` project for an example. ( It shows queries, mutation, setting client with auth headers, cache-management, cache manipulation and different fetch policies )

#### **Using ApolloClient with React**

- Apollo Client caching - Automatic caching is done for queries but not for mutations. To cache mutations, use `update` function in the mutation options. ( Refer to `job-board-client` or `chat` project for an example )
- For mutations, one can write or update the cache manually using `writeQuery` or `updateQuery` functions.
- It also provides react hooks for queries and mutations. ( Refer to `job-board-client` project where `useQuery` and `useMutation` hooks are used in our custom react hooks)

#### **GraphQL Fragments**

- Fragments are used to reuse parts of a query. They are useful when the same fields are used in multiple queries.

#### **Backend Optimisations**

- For every job, the company details are fetched from the database. Therefore for every N jobs, N+1 queries are executed. Batching the company details query will reduce the number of queries to 2. DataLoader is used for batching in `job-board` project.
- In initial implementation, we created a global instance of DataLoader and used it in all resolvers. Due to this data was globally cached.
- Either one should clear the cache after every update fn on db or create a new instance of DataLoader for every request [ PER REQ CACHE ] . ( `job-board` project uses the second approach )
- One could argue that having a global dataLoader with cache disabled would be better, but in case where we have multiple duplicate ids in a single query, the db will be hit multiple times, whereas PER REQ CACHE will hit the db only once.

#### **Difference Btw Query and Mutation Operations**

- Query operation is used for querying data from server, whereas mutation is used for Create, update, delete data on server.
- Although query seems to be Read call, Graphql used as POST API for both of these.
- While query fields are executed in parallel, mutation fields run in series, one after the other.

  ```graphql
  # getUser and getPosts execute in parallel

  query {
    getUser(id: "123") {
      id
      name
    }
    getPosts {
      id
      title
    }
  }
  ```

  ```graphql
  # createUser is executed 1st and then updatePost

  mutation {
    createUser(name: "Alice") {
      id
      name
    }
    updatePost(id: "456", title: "Updated Title") {
      id
      title
    }
  }
  ```

#### [**Cursor vs Offset Pagination**](https://betterprogramming.pub/understanding-the-offset-and-cursor-pagination-8ddc54d10d98)

#### **GraphQL Subscriptions**

- GraphQL Subscriptions are used to subscribe to real time data from server. Generally this is done by using GraphQL over websockets.
- For setting up graphql over websockets, just use any websocket lib such as `ws` or `socket.io` and attach graphql to it. ( Refer to `chat` project for an example )
- Resolvers for subscriptions are a bit different from query and mutation. They return an [`AsyncIterator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncIterator) instead of a promise. ( Refer to `chat` project for an example )
- The PubSub class is used to publish and subscribe to events. ( Refer to `chat` project for an example ). Although it is not recommended to use this in production, since data is stored in memory and will be lost on server restart or issues when 1 has multiple servers. In such cases, one should use a pubsub service such as `Redis` or `AWS SNS` or `RabbitMQ` etc.
- Context can be passed to subscriptions while setting up graphQL over ws ( Refer to `chat` project for an example )
- [Using Subscriptions on Client Side with Apollo Client](https://www.apollographql.com/docs/react/data/subscriptions)

#### **Using GraphQL with TS**

- Specifying TS types for GraphQL typeDefs manually can be a bit tedious, often leading to errors and complexity.
- [GraphQL Code Generator](https://graphql-code-generator.com/) can be used to generate types for resolvers, so we don't need to specify types for `_root`, `_args`, `_context` etc manually.
- This type generation can be done on server side or client side. ( Refer to `job-board` project for an example )
- [Guide of Server-Side Type Generation](https://www.apollographql.com/docs/apollo-server/workflow/generate-types/)
- [Guide of Client-Side Type Generation](https://www.apollographql.com/docs/react/development-testing/static-typing/)
- It is a good practice to add generated types to `.gitignore`.
- These types should be generated at each build. Also at dev modes, these types should be generated on watch mode to avoid manual generation. ( Refer to `scripts` in `package.json` of `job-board` project for an example )
- Often times some config to match db results to graphql types. ( Refer to `schema.yml` in `job-board\server` project for an example )
- Client-preset has fragment-masking enabled by default as mentioned [here](https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#fragment-masking). This can be useful to avoid leaks but can also be disabled if required.

#### **Best Practices**

- [Best Practices](https://graphql.org/learn/best-practices/)
- While building Production projects, business logic and authorization logic should be handled at business layer and not at GraphQL resolvers. Ie a fn can be used by REST / GraphQL / gRPC etc, so authorization should be at fn level and not at resolver level.
- Usually in cursor based pagination, node and edges are returned. Node contains the actual data and edges contain the cursor. [More for info](https://graphql.org/learn/pagination/#pagination-and-edges)
