import DataLoader from 'dataloader'

export type JobEntity = {
  id: string
  companyId: string
  title: string
  description?: string | null
  createdAt: string
}

export type CompanyEntity = {
  id: string
  name: string
  description?: string | null
}

export type UserEntity = {
  id: string
  companyId: string
  email: string
  password: string
}

export type ContextEntity = {
  user?: UserEntity
  companyLoader: DataLoader<string, CompanyEntity, string>
}
