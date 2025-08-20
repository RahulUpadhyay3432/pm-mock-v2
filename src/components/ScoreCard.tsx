'use client'

import { cn, getScoreColor, getScoreLabel } from '@/lib/utils'

interface ScoreData {
  rubric: {
    structure: number
    clarity: number
    product_thinking: number
    metrics: number
    communication: number
  }
  strengths: string[]
  gaps: string[]
  overall_score: number
  coaching: string
}

interface ScoreCardProps {
  scoreData: ScoreData
  className?: string
}

export function ScoreCard({ scoreData, className }: ScoreCardProps) {
  const { rubric, strengths, gaps, overall_score, coaching } = scoreData

  const rubricItems = [
    { key: 'structure', label: 'Structure & Framework', value: rubric.structure },
    { key: 'clarity', label: 'Clarity & Communication', value: rubric.clarity },
    { key: 'product_thinking', label: 'Product Thinking', value: rubric.product_thinking },
    { key: 'metrics', label: 'Metrics & Measurement', value: rubric.metrics },
    { key: 'communication', label: 'Storytelling', value: rubric.communication },
  ]

  return (
    <div className={cn("bg-white rounded-lg shadow-lg p-6", className)}>
      <div className="text-center mb-6">
        <div className={cn("text-4xl font-bold mb-2", getScoreColor(overall_score))}>
          {overall_score}
        </div>
        <div className="text-lg text-gray-600">
          {getScoreLabel(overall_score)}
        </div>
      </div>

      {/* Rubric Breakdown */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Detailed Scores</h3>
        <div className="space-y-3">
          {rubricItems.map(({ key, label, value }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{label}</span>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      className={cn(
                        "w-4 h-4 rounded-full",
                        star <= value ? "bg-blue-500" : "bg-gray-200"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium w-8">{value}/5</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-green-700 mb-2">Strengths</h3>
          <ul className="space-y-1">
            {strengths.map((strength, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Areas for Improvement */}
      {gaps.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-orange-700 mb-2">Areas for Improvement</h3>
          <ul className="space-y-1">
            {gaps.map((gap, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 mt-1">→</span>
                {gap}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Coaching */}
      {coaching && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Coaching Tips</h3>
          <p className="text-sm text-blue-800">{coaching}</p>
        </div>
      )}
    </div>
  )
}