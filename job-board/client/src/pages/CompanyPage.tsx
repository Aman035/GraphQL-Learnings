import { useParams } from 'react-router'
import JobList from '../components/JobList'
import { useGetCompany } from '../graphql/hooks'

const CompanyPage: React.FC = () => {
  const { companyId } = useParams()
  const { company, loading, error } = useGetCompany(companyId)

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div className="has-text-danger">Data Unavailable</div>
  }
  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h2 className="title is-5">Jobs At {company.name}</h2>
      <JobList jobs={company.jobs} />
    </div>
  )
}

export default CompanyPage
