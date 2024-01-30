import { useQuery, useMutation } from '@apollo/client'
import { createJobMutation } from './mutations'
import { getJobByIdQuery, getJobsQuery, getCompanyByIdQuery } from './queries'
/**
 * THIS FILE CONTAINS CUSTOM REACT HOOKS
 * All react are internaly using useQuery and useMutation hooks from @apollo/client
 * Note - React hoooks name should always start with use
 */

export const useGetJobs = (page: number, limit: number) => {
  const { data, loading, error } = useQuery(getJobsQuery, {
    fetchPolicy: 'network-only',
    variables: { page, limit },
  })
  return {
    jobs: data?.jobs,
    loading,
    error,
  }
}

export const useGetJob = (id: string) => {
  const { data, loading, error } = useQuery(getJobByIdQuery, {
    variables: { id },
  })
  return { job: data?.job, loading, error }
}

export const useGetCompany = (id: string) => {
  const { data, loading, error } = useQuery(getCompanyByIdQuery, {
    variables: { id },
  })
  return { company: data?.company, loading, error }
}

export const useCreateJob = () => {
  const [mutate, { loading }] = useMutation(createJobMutation)

  const createJob = async (title: string, description: string) => {
    const { data } = await mutate({
      variables: { input: { title, description } },
      update: (cache, { data }) => {
        data &&
          data.job &&
          cache.writeQuery({
            query: getJobByIdQuery,
            variables: { id: data.job.id },
            data,
          })
      },
    })
    return data?.job
  }

  return { loading, createJob }
}
