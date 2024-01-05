import DataLoader from 'dataloader'
import { connection } from './connection'
import { Company } from '../types'

const getCompanyTable = () => connection.table('company')

export const getCompany = async (id: string): Promise<Company> => {
  return await getCompanyTable().first().where({ id })
}

export const createCompanyLoader = async () => {
  return new DataLoader(async (ids: readonly string[]) => {
    const companies = await getCompanyTable().select().whereIn('id', ids)
    /**
     * The order of the companies returned from the database is not guaranteed
     * to match the order of the ids passed in. We need to make sure that the
     * companies are returned in the same order as the ids passed in.
     */
    return ids.map((id) => companies.find((company) => company.id === id))
  })
}
