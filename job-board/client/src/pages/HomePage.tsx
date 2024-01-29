import JobList from '../components/JobList'
import { useGetJobs } from '../graphql/hooks'
import { useState } from 'react'
import PaginationBar from '../components/PaginationBar'

const HomePage: React.FC = () => {
  const JOB_PER_PAGE_LIMIT = 10
  const [page, setPage] = useState<number>(1)
  const { jobs, loading, error } = useGetJobs(page, JOB_PER_PAGE_LIMIT)
  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div className="has-text-danger">Data unavailable</div>
  }

  const TOTAL_PAGES = Math.ceil(jobs.totalCount / JOB_PER_PAGE_LIMIT)
  return (
    <div>
      <h1 className="title">Job Board</h1>
      <PaginationBar
        currentPage={page}
        totalPages={TOTAL_PAGES}
        onPageChange={setPage}
      />
      <JobList jobs={jobs.items} />
    </div>
  )
}

export default HomePage
