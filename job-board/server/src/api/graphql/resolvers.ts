import { GraphQLError } from 'graphql'
import { getCompany } from '../../db/companies'
import {
  countJobs,
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getJobsByCompany,
  updateJob,
} from '../../db/jobs'
import { Company, Job, User } from '../../types'
import DataLoader from 'dataloader'

export const resolvers = {
  Query: {
    job: async (_root: any, { id }: { id: string }) => {
      const job = await getJob(id)
      if (!job) {
        notFoundError(`No job found with id: ${id}`)
      }
      return job
    },
    company: async (_root: any, { id }: { id: string }) => {
      const company = await getCompany(id)
      if (!company) {
        notFoundError(`No company found with id: ${id}`)
      }
      return company
    },
    jobs: async (
      _root: any,
      { page, limit }: { page: number; limit: number }
    ) => {
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
      _root: any,
      {
        input: { title, description },
      }: { input: { title: string; description: string | null } },
      // Context
      { user }: { user?: User }
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
      _root: any,
      {
        input: { id, title, description },
      }: { input: { id: string; title: string; description: string | null } },
      { user }: { user?: User }
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
    deleteJob: async (
      _root: any,
      { id }: { id: string },
      { user }: { user?: User }
    ) => {
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
    date: async (job: Job) => toIsoDate(job.createdAt),
    company: async (
      job: Job,
      args: any,
      { companyLoader }: { companyLoader: DataLoader<string, any, string> }
    ) => await companyLoader.load(job.companyId),
  },
  Company: {
    jobs: async (company: Company) => getJobsByCompany(company.id),
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
