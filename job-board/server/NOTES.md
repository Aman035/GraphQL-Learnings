# NOTES

- GraphQL types can be null by default. To make them required, add an exclamation mark after the type name.
- Simple Comments can be added with the # symbol
- To add a description to a type, add a triple quote block above the type definition. ( Can be seen on local server at http://localhost:4000/graphql )
- Direct resolvers override the default resolver for a field. ( Check resolver for `Job.date` )
- Biderectional associations can be made in GraphQL. Ie Fetching Jobs Posted By a Company & Fetching Companies that Posted a Job. ( Check resolver for `Company.jobs` & `Job.company` )
- GraphQL as the name suggests has built in recursive queries.
  ( In the below example, the query for `Company.jobs` will be executed first, then the query for `Job.company` will be executed for each job returned by the first query )
  A good example where this would be beneficial would be fetching friends of friends to show suggestions on a social app.
  ```
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
