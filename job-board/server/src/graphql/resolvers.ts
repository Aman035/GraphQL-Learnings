import { GraphQLError } from 'graphql'
import { getCompany } from '../db/companies'
import {
  countJobs,
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getJobsByCompany,
  updateJob,
} from '../db/jobs'
import { Resolvers } from './generated/schema'

export const resolvers: Resolvers = {
  Query: {
    job: async (_root, { id }) => {
      const job = await getJob(id)
      if (!job) {
        throw notFoundError(`No job found with id: ${id}`)
      }
      return job
    },
    company: async (_root, { id }) => {
      const company = await getCompany(id)
      if (!company) {
        throw notFoundError(`No company found with id: ${id}`)
      }
      return company
    },
    jobs: async (_root, { page, limit }) => {
      const MAX_LIMIT = 50
      if (limit > MAX_LIMIT) {
        badRequestError(`limit must be less than ${MAX_LIMIT}`)
      }
      const items = await getJobs(limit, page)
      const totalCount = await countJobs()
      return {
        items,
        totalCount,
      }
    },
  },
  Mutation: {
    createJob: async (
      _root,
      { input: { title, description } },
      // Context
      { user }
    ) => {
      if (!user) {
        unAuthorizedError('Missing authentication')
      }
      const job = createJob({
        companyId: user?.companyId as string,
        title,
        description,
      })
      return job
    },
    updateJob: async (
      _root,
      { input: { id, title, description } },
      { user }
    ) => {
      if (!user) {
        unAuthorizedError('Missing authentication')
      }

      const job = await updateJob({
        id,
        title,
        description,
        companyId: user?.companyId as string,
      })
      if (!job) {
        notFoundError(`No job found with id: ${id}`)
      }
      return job
    },
    deleteJob: async (_root, { id }, { user }) => {
      if (!user) {
        unAuthorizedError('Missing authentication')
      }
      const job = await deleteJob(id, user?.companyId as string)
      if (!job) {
        notFoundError(`No job found with id: ${id}`)
      }
      return job
    },
  },
  /**
   * @dev - This is a resolver for the Job type, here we can define how to resolve the fields of the Job type.
   * @notice - This resolver will also override if date field was already present in the Job type.
   */
  Job: {
    date: async (job) => toIsoDate(job.createdAt),
    company: async (job, args, { companyLoader }) =>
      await companyLoader.load(job.companyId),
  },
  Company: {
    jobs: async (company) => getJobsByCompany(company.id),
  },
}

const toIsoDate = (value: string) => {
  return value.slice(0, 'yyyy-mm-dd'.length)
}

const notFoundError = (message: string) => {
  throw new GraphQLError(message, {
    extensions: { code: 'NOT_FOUND' },
  })
}

const unAuthorizedError = (message: string) => {
  throw new GraphQLError(message, {
    extensions: { code: 'UNAUTHORIZED' },
  })
}

const badRequestError = (message: string) => {
  throw new GraphQLError(message, {
    extensions: { code: 'BAD_REQUEST' },
  })
}
