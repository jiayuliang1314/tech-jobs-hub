import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { affiliateManager, type Job } from '@/utils/affiliates'

export default function JobDetail() {
  const router = useRouter()
  const { id } = router.query
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      // 模拟数据加载 - 实际应该从GitHub或API获取
      loadJobData(id as string)
    }
  }, [id])

  const loadJobData = async (jobId: string) => {
    try {
      // TODO: 实际从GitHub仓库或API加载数据
      // const response = await fetch(`${process.env.GITHUB_DATA_URL}/airbnb.json`)
      // const data = await response.json()
      
      // 示例数据
      const mockJob: Job = {
        id: jobId,
        title: 'Software Engineer - Backend',
        company: 'Airbnb',
        location: 'San Francisco, CA',
        url: 'https://careers.airbnb.com/positions/7353690',
        description: `
          <h3>About the Role</h3>
          <p>We're looking for a talented Backend Engineer to join our team...</p>
          <h3>Responsibilities</h3>
          <ul>
            <li>Build scalable distributed systems</li>
            <li>Work with Python, Go, and Java</li>
            <li>Collaborate with cross-functional teams</li>
          </ul>
          <h3>Requirements</h3>
          <ul>
            <li>5+ years of backend development experience</li>
            <li>Strong CS fundamentals</li>
            <li>Experience with microservices</li>
          </ul>
        `,
        updated_at: new Date().toISOString()
      }
      
      setJob(mockJob)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load job:', error)
      setLoading(false)
    }
  }

  const trackClick = async (platform: string) => {
    // 追踪联盟链接点击
    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: job?.id,
          company: job?.company,
          platform,
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

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Job not found</div>
      </div>
    )
  }

  const affiliateLinks = affiliateManager.generateAllLinks(job)

  return (
    <>
      <Head>
        <title>{job.title} at {job.company} - {job.location} | Tech Jobs Hub</title>
        <meta name="description" content={`Apply to ${job.title} at ${job.company} in ${job.location}. See salary data, employee reviews & interview tips.`} />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Job Title */}
          <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
          <p className="text-xl text-gray-600 mb-6">
            {job.company} • {job.location}
          </p>

          {/* Apply Buttons Section - 核心盈利区域 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Apply to this job</h2>
            
            {/* 按钮1: 原始链接（建立信任） */}
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-600 hover:bg-green-700 text-white text-center font-bold py-4 px-6 rounded-lg mb-3 transition"
            >
              ✅ Apply Directly on {job.company} Career Page
            </a>

            {/* 按钮2: Indeed联盟链接（主要收入 $0.75/点击） */}
            <a
              href={affiliateLinks.indeed}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick('indeed')}
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg mb-3 transition"
            >
              <div className="flex items-center justify-center">
                <span className="text-2xl mr-2">⭐</span>
                <div className="text-left">
                  <div className="text-lg">Apply via Indeed</div>
                  <div className="text-sm font-normal opacity-90">
                    Also browse 1,000+ similar {job.title} jobs
                  </div>
                </div>
              </div>
            </a>

            {/* 按钮3: ZipRecruiter联盟链接（$10/注册） */}
            <a
              href={affiliateLinks.ziprecruiter}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick('ziprecruiter')}
              className="block w-full border-2 border-blue-600 hover:bg-blue-50 text-blue-600 font-bold py-4 px-6 rounded-lg transition"
            >
              <div className="text-lg">Apply via ZipRecruiter</div>
              <div className="text-sm font-normal">
                One-click apply to multiple jobs
              </div>
            </a>
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: job.description || '' }} 
            />
          </div>

          {/* Company Insights - Glassdoor联盟链接（$1.50/点击） */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-4">
              💡 Before you apply, learn more about {job.company}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-3xl mb-2">⭐</div>
                <div className="font-bold text-lg">Employee Reviews</div>
                <div className="text-sm opacity-90">
                  Real feedback from current & former employees
                </div>
              </div>

              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-3xl mb-2">💰</div>
                <div className="font-bold text-lg">Salary Data</div>
                <div className="text-sm opacity-90">
                  Know what {job.title}s actually earn at {job.company}
                </div>
              </div>

              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-3xl mb-2">💼</div>
                <div className="font-bold text-lg">Interview Tips</div>
                <div className="text-sm opacity-90">
                  Real interview questions & hiring process
                </div>
              </div>
            </div>

            <a
              href={affiliateLinks.glassdoor}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick('glassdoor')}
              className="block w-full bg-white text-purple-600 text-center font-bold py-4 px-6 rounded-lg hover:bg-gray-100 transition"
            >
              View {job.company} on Glassdoor →
            </a>
          </div>

          {/* Disclosure */}
          <p className="text-xs text-gray-500 mt-8 text-center">
            <strong>Disclosure:</strong> Some links on this page are affiliate links. 
            We may earn a commission if you click and apply through Indeed, ZipRecruiter, or Glassdoor. 
            This helps us keep the service free for job seekers.
          </p>
        </div>
      </main>
    </>
  )
}

