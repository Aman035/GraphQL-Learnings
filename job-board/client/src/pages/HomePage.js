import JobList from '../components/JobList'
import { useGetJobs } from '../graphql/hooks'

function HomePage() {
  const { jobs } = useGetJobs()
  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  )
}

export default HomePage
