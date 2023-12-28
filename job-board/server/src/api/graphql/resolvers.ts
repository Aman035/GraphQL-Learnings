import { getCompany } from '../../db/companies'
import { getJob, getJobs, getJobsByCompany } from '../../db/jobs'
import { Company, Job } from '../../types'

export const resolvers = {
  Query: {
    job: async (_root: any, { id }: { id: string }) => await getJob(id),
    company: async (_root: any, { id }: { id: string }) => await getCompany(id),
    jobs: async () => await getJobs(10, 0),
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
