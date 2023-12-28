export type Job = {
  id: string
  companyId: string
  title: string
  description: string
  createdAt: string
}

export type Company = {
  id: string
  name: string
  description: string
}

export type User = {
  id: string
  companyId: string
  email: string
  password: string
}
