import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { getCompany } from '../graphql/queries'
import JobList from '../components/JobList'

function CompanyPage() {
  const { companyId } = useParams()

  const [state, setState] = useState({
    company: null,
    loading: true,
    error: false,
  })

  useEffect(() => {
    getCompany(companyId)
      .then((company) => {
        setState({ company, loading: false, error: false })
      })
      .catch((error) => {
        setState({ company: null, loading: false, error: true })
      })
  }, [companyId])

  const { company, loading, error } = state

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
