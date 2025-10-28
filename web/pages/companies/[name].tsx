import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { affiliateManager, type Job } from '@/utils/affiliates'

export default function CompanyPage() {
  const router = useRouter()
  const { name } = router.query
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [companyName, setCompanyName] = useState('')

  useEffect(() => {
    if (name) {
      loadCompanyJobs(name as string)
    }
  }, [name])

  const loadCompanyJobs = async (company: string) => {
    try {
      // TODO: 从GitHub加载该公司的JSON文件
      // const response = await fetch(`${process.env.GITHUB_DATA_URL}/${company.toLowerCase()}.json`)
      // const data = await response.json()
      
      // 示例数据
      const formattedName = company.charAt(0).toUpperCase() + company.slice(1)
      setCompanyName(formattedName)
      
      const mockJobs: Job[] = Array.from({ length: 15 }, (_, i) => ({
        id: `${company}-${i}`,
        title: ['Software Engineer', 'Product Designer', 'Data Scientist', 'Product Manager'][i % 4],
        company: formattedName,
        location: ['San Francisco, CA', 'New York, NY', 'Remote', 'Seattle, WA'][i % 4],
        url: `https://careers.${company}.com/jobs/${i}`,
        updated_at: new Date(Date.now() - i * 86400000).toISOString()
      }))
      
      setJobs(mockJobs)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load company jobs:', error)
      setLoading(false)
    }
  }

  const trackClick = async (platform: string) => {
    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: companyName,
          platform,
          page: 'company_page',
          timestamp: Date.now()
        })
      })
    } catch (error) {
      console.error('Failed to track click:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  const glassdoorLink = affiliateManager.generateGlassdoorCompanyLink(companyName)

  return (
    <>
      <Head>
        <title>{companyName} Jobs - {jobs.length} Open Positions | Tech Jobs Hub</title>
        <meta name="description" content={`Browse ${jobs.length} open positions at ${companyName}. See company reviews, salaries, and interview tips.`} />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Company Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">{companyName}</h1>
            <p className="text-2xl opacity-90">
              {jobs.length} open positions
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Company Insights Card - Glassdoor联盟链接 */}
              <div className="bg-purple-600 text-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-2xl font-bold mb-4">
                  💡 Learn about {companyName}
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">⭐</span>
                    <div>
                      <div className="font-bold">Company Rating</div>
                      <div className="text-sm opacity-90">Employee reviews & ratings</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">💰</span>
                    <div>
                      <div className="font-bold">Salary Data</div>
                      <div className="text-sm opacity-90">Real compensation numbers</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">💼</span>
                    <div>
                      <div className="font-bold">Interview Process</div>
                      <div className="text-sm opacity-90">Questions & tips from candidates</div>
                    </div>
                  </div>
                </div>

                <a
                  href={glassdoorLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick('glassdoor')}
                  className="block w-full bg-white text-purple-600 text-center font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition"
                >
                  View on Glassdoor →
                </a>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Jobs:</span>
                    <span className="font-semibold">{jobs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remote Jobs:</span>
                    <span className="font-semibold">
                      {jobs.filter(j => j.location.toLowerCase().includes('remote')).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-semibold">Today</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Jobs List */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Open Positions</h2>
                <p className="text-gray-600">
                  Showing all {jobs.length} jobs at {companyName}
                </p>
              </div>

              <div className="space-y-4">
                {jobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="block bg-white rounded-lg shadow hover:shadow-lg transition p-6"
                  >
                    <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-blue-600">
                      {job.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <span>{job.location}</span>
                      <span className="mx-2">•</span>
                      <span className="text-sm">
                        Updated {new Date(job.updated_at || '').toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Full-time
                      </span>
                      {job.location.toLowerCase().includes('remote') && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Remote
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

