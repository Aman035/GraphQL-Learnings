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
    return ids.map((id) => companies.find((company) => company.id === id))
  })
}
