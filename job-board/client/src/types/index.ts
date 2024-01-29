export type UserEntity = {
  id: string
  email: string
}

export type JobEntity = {
  id: string
  title: string
  date: string
  company: {
    name: string
  }
}
