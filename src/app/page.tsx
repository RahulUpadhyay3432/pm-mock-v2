'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { formatDuration, getScoreColor } from '@/lib/utils'
import { RequireAuth } from '@/components/RequireAuth'

interface PMAttempt {
  id: string
  mode: string
  topic: string | null
  overallScore: number | null
  durationSec: number | null
  createdAt: string
}

export default function Dashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [attempts, setAttempts] = useState<PMAttempt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchAttempts()
    }
  }, [session])

  const fetchAttempts = async () => {
    try {
      const response = await fetch('/api/attempts')
      if (response.ok) {
        const data = await response.json()
        setAttempts(data)
      }
    } catch (error) {
      console.error('Failed to fetch attempts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                PM Mock Interviewer
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {session?.user?.name || session?.user?.email}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/settings')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Settings
              </button>
              <button
                onClick={() => router.push('/interview')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
              >
                Start Interview
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-2xl font-bold text-gray-900">
                {attempts.length}
              </div>
              <div className="text-gray-600">Total Interviews</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-2xl font-bold text-gray-900">
                {attempts.length > 0 
                  ? Math.round(
                      attempts
                        .filter(a => a.overallScore)
                        .reduce((sum, a) => sum + (a.overallScore || 0), 0) /
                      attempts.filter(a => a.overallScore).length
                    )
                  : 0
                }
              </div>
              <div className="text-gray-600">Average Score</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-2xl font-bold text-gray-900">
                {attempts.length > 0
                  ? formatDuration(
                      Math.round(
                        attempts
                          .filter(a => a.durationSec)
                          .reduce((sum, a) => sum + (a.durationSec || 0), 0) /
                        attempts.filter(a => a.durationSec).length
                      )
                    )
                  : '0:00'
                }
              </div>
              <div className="text-gray-600">Avg Duration</div>
            </div>
          </div>

          {/* History Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Interview History
              </h2>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading...</p>
              </div>
            ) : attempts.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No interviews yet</p>
                <button
                  onClick={() => router.push('/interview')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Start Your First Interview
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Topic
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attempts.map((attempt) => (
                      <tr key={attempt.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(attempt.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {attempt.topic || 'General'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            attempt.mode === 'voice' 
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {attempt.mode}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {attempt.overallScore ? (
                            <span className={`font-medium ${getScoreColor(attempt.overallScore)}`}>
                              {attempt.overallScore}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {attempt.durationSec ? formatDuration(attempt.durationSec) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}