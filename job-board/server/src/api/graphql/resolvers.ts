import { GraphQLError } from 'graphql'
import { getCompany } from '../../db/companies'
import {
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getJobsByCompany,
  updateJob,
} from '../../db/jobs'
import { Company, Job } from '../../types'

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
    jobs: async () => await getJobs(10, 0),
  },
  Mutation: {
    createJob: async (
      _root: any,
      {
        input: { title, description },
      }: { input: { title: string; description: string | null } }
    ) => {
      /** @todo : Change this after authentication */
      const companyId = 'FjcJCHJALA4i'
      const job = createJob({ companyId, title, description })
      return job
    },
    updateJob: async (
      _root: any,
      {
        input: { id, title, description },
      }: { input: { id: string; title: string; description: string | null } }
    ) => {
      const job = await updateJob({ id, title, description })
      return job
    },
    deleteJob: async (_root: any, { id }: { id: string }) => {
      const job = await deleteJob(id)
      return job
    },
  },
  /**
   * @dev - This is a resolver for the Job type, here we can define how to resolve the fields of the Job type.
   * @notice - This resolver will also override if date field was already present in the Job type.
   */
  Job: {
    date: async (job: Job) => toIsoDate(job.createdAt),
    company: async (job: Job) => getCompany(job.companyId),
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
