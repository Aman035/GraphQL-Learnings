import { connection } from './connection'
import { generateId } from './ids'
import { JobEntity } from '../types'

const getJobTable = () => connection.table<JobEntity>('job')

export const countJobs = async (): Promise<number> => {
  const { count } = (await getJobTable().first().count('* as count')) as any
  return count
}

export const getJobs = async (
  limit: number,
  page: number
): Promise<JobEntity[]> => {
  const offset = limit * (page - 1)
  return await getJobTable()
    .select()
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .offset(offset)
}

export const getJobsByCompany = async (
  companyId: string
): Promise<JobEntity[]> => {
  return await getJobTable().select().where({ companyId })
}

export const getJob = async (id: string) => {
  return await getJobTable().first().where({ id })
}

export const createJob = async ({
  companyId,
  title,
  description,
}: {
  companyId: string
  title: string
  description?: string | null
}): Promise<JobEntity> => {
  const job = {
    id: generateId(),
    companyId,
    title,
    description,
    createdAt: new Date().toISOString(),
  }
  await getJobTable().insert(job)
  return job
}

/**
 * @dev - companyId is passed to ensure that only the company that created the job can delete it
 */
export const deleteJob = async (
  id: string,
  companyId: string
): Promise<JobEntity | null> => {
  const job = await getJobTable().first().where({ id, companyId })
  if (!job) {
    return null
  }
  await getJobTable().delete().where({ id })
  return job
}

/**
 * @dev - companyId is passed to ensure that only the company that created the job can update it
 */
export const updateJob = async ({
  id,
  title,
  description,
  companyId,
}: {
  id: string
  title: string
  description?: string | null
  companyId: string
}): Promise<JobEntity | null> => {
  const job = await getJobTable().first().where({ id, companyId })
  if (!job) {
    return null
  }
  const updatedFields = { title, description }
  await getJobTable().update(updatedFields).where({ id })
  return { ...job, ...updatedFields }
}
