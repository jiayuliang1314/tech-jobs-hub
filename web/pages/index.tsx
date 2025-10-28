import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (location) params.set('location', location)
    window.location.href = `/jobs?${params.toString()}`
  }

  return (
    <>
      <Head>
        <title>Tech Jobs Hub - 50,000+ Jobs from 3,000+ Companies</title>
        <meta name="description" content="Find your dream tech job. Browse 50,000+ positions from top companies like Airbnb, Stripe, Notion. Updated daily." />
      </Head>

      <main className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center">
              Find Your Dream Tech Job
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-center opacity-90">
              50,000+ jobs from 3,000+ top tech companies
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-2xl p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Job title, keyword..."
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Location..."
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                  >
                    Search Jobs
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">3,000+ Companies</h3>
              <p className="text-gray-600">
                From startups to Fortune 500, all in one place
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🔄</div>
              <h3 className="text-xl font-bold mb-2">Updated Daily</h3>
              <p className="text-gray-600">
                New jobs added automatically every day
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-xl font-bold mb-2">Company Insights</h3>
              <p className="text-gray-600">
                Salary data, reviews, and interview tips
              </p>
            </div>
          </div>
        </div>

        {/* Top Companies */}
        <div className="bg-gray-100 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Popular Companies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {['Airbnb', 'Stripe', 'Notion', 'Figma', 'Databricks', 'Coinbase', 
                'DoorDash', 'Instacart', 'Robinhood', 'Plaid', 'Airtable', 'Vercel'].map((company) => (
                <Link
                  key={company}
                  href={`/companies/${company.toLowerCase()}`}
                  className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition font-semibold text-gray-700"
                >
                  {company}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to find your next opportunity?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Browse thousands of jobs or search for specific roles
          </p>
          <Link
            href="/jobs"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition duration-200 text-lg"
          >
            Browse All Jobs →
          </Link>
        </div>
      </main>
    </>
  )
}

