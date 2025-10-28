import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import type { Job } from '@/utils/affiliates'

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])

  useEffect(() => {
    // 从URL参数获取搜索条件
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q') || ''
    const loc = params.get('location') || ''
    setSearch(q)
    setLocation(loc)
    
    loadJobs()
  }, [])

  useEffect(() => {
    // 过滤职位
    let filtered = jobs
    
    if (search) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(location.toLowerCase())
      )
    }
    
    setFilteredJobs(filtered)
  }, [jobs, search, location])

  const loadJobs = async () => {
    try {
      // TODO: 实际从GitHub加载数据
      // 可以加载多个公司的JSON文件并合并
      
      // 示例：模拟数据
      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'Senior Software Engineer - Backend',
          company: 'Airbnb',
          location: 'San Francisco, CA',
          url: 'https://careers.airbnb.com/positions/1',
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Frontend Engineer',
          company: 'Stripe',
          location: 'Remote',
          url: 'https://stripe.com/jobs/1',
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Product Designer',
          company: 'Notion',
          location: 'New York, NY',
          url: 'https://notion.so/jobs/1',
          updated_at: new Date().toISOString()
        },
        // 实际应该加载更多数据
      ]
      
      setJobs(mockJobs)
      setFilteredJobs(mockJobs)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load jobs:', error)
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // 更新URL参数
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (location) params.set('location', location)
    window.history.pushState({}, '', `?${params.toString()}`)
  }

  return (
    <>
      <Head>
        <title>Tech Jobs - Browse 100,000+ Positions | Tech Jobs Hub</title>
        <meta name="description" content="Browse 100,000+ tech jobs from 3,000+ companies. Find software engineering, product, design, and data roles. Updated daily." />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Tech Jobs Hub
              </Link>
              <div className="text-sm text-gray-600">
                {filteredJobs.length.toLocaleString()} jobs found
              </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Job title, keyword..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Location..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Jobs List */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-xl">Loading jobs...</div>
            </div>
          ) : (
            <>
              {/* Filter Summary */}
              {(search || location) && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      Showing results for:
                      {search && <span className="ml-2 font-semibold">"{search}"</span>}
                      {location && <span className="ml-2 font-semibold">in {location}</span>}
                    </div>
                    <button
                      onClick={() => {
                        setSearch('')
                        setLocation('')
                        window.history.pushState({}, '', '/jobs')
                      }}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Clear filters
                    </button>
                  </div>
                </div>
              )}

              {/* Job Cards */}
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="block bg-white rounded-lg shadow hover:shadow-lg transition p-6"
                  >
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 hover:text-blue-600">
                      {job.title}
                    </h2>
                    <div className="flex items-center text-gray-600 mb-3">
                      <span className="font-semibold">{job.company}</span>
                      <span className="mx-2">•</span>
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
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
                      <span className="text-sm text-gray-500">
                        Updated {new Date(job.updated_at || '').toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* No Results */}
              {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold mb-2">No jobs found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search criteria
                  </p>
                  <button
                    onClick={() => {
                      setSearch('')
                      setLocation('')
                      window.history.pushState({}, '', '/jobs')
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
                  >
                    View all jobs
                  </button>
                </div>
              )}

              {/* Load More (Pagination) */}
              {filteredJobs.length > 20 && (
                <div className="text-center mt-8">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition">
                    Load More Jobs
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  )
}

