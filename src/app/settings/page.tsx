'use client'

import { useState } from 'react'
import { RequireAuth } from '@/components/RequireAuth'

type QuestionType = 'Product Sense' | 'Estimation' | 'Execution' | 'Strategy'
type VoiceProvider = 'Browser' | 'OpenAI Realtime'

export default function Settings() {
  const [timerDuration, setTimerDuration] = useState(120)
  const [questionType, setQuestionType] = useState<QuestionType>('Product Sense')
  const [voiceProvider, setVoiceProvider] = useState<VoiceProvider>('Browser')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // Save to localStorage for now (could be moved to user preferences in DB)
    localStorage.setItem('pm-interview-settings', JSON.stringify({
      timerDuration,
      questionType,
      voiceProvider,
    }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Load settings on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pm-interview-settings')
      if (saved) {
        const settings = JSON.parse(saved)
        setTimerDuration(settings.timerDuration || 120)
        setQuestionType(settings.questionType || 'Product Sense')
        setVoiceProvider(settings.voiceProvider || 'Browser')
      }
    }
  })

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <button
              onClick={() => window.location.href = '/'}
              className="text-gray-600 hover:text-gray-900"
            >
              Back to Dashboard
            </button>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-8">
              {/* Timer Duration */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Timer Duration
                </h2>
                <div className="space-y-3">
                  {[60, 90, 120].map((duration) => (
                    <label key={duration} className="flex items-center">
                      <input
                        type="radio"
                        name="timer"
                        value={duration}
                        checked={timerDuration === duration}
                        onChange={(e) => setTimerDuration(Number(e.target.value))}
                        className="mr-3 text-blue-600"
                      />
                      <span className="text-gray-700">
                        {duration / 60} minute{duration > 60 ? 's' : ''} ({duration} seconds)
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question Type */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Default Question Type
                </h2>
                <div className="space-y-3">
                  {(['Product Sense', 'Estimation', 'Execution', 'Strategy'] as QuestionType[]).map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="questionType"
                        value={type}
                        checked={questionType === type}
                        onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                        className="mr-3 text-blue-600"
                      />
                      <div>
                        <span className="text-gray-700 font-medium">{type}</span>
                        <p className="text-sm text-gray-500">
                          {getQuestionTypeDescription(type)}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Voice Provider */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Voice Provider
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="voiceProvider"
                      value="Browser"
                      checked={voiceProvider === 'Browser'}
                      onChange={(e) => setVoiceProvider(e.target.value as VoiceProvider)}
                      className="mr-3 text-blue-600"
                    />
                    <div>
                      <span className="text-gray-700 font-medium">Browser</span>
                      <p className="text-sm text-gray-500">
                        Uses your browser's built-in speech recognition (free, works offline)
                      </p>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="voiceProvider"
                      value="OpenAI Realtime"
                      checked={voiceProvider === 'OpenAI Realtime'}
                      onChange={(e) => setVoiceProvider(e.target.value as VoiceProvider)}
                      className="mr-3 text-blue-600"
                      disabled
                    />
                    <div>
                      <span className="text-gray-400 font-medium">
                        OpenAI Realtime (Coming Soon)
                      </span>
                      <p className="text-sm text-gray-400">
                        Higher accuracy speech recognition with real-time processing
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    saved
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {saved ? 'Settings Saved!' : 'Save Settings'}
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                Keyboard Shortcuts
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li><kbd className="bg-blue-200 px-2 py-1 rounded">Space</kbd> - Start/Stop recording (Voice mode)</li>
                <li><kbd className="bg-blue-200 px-2 py-1 rounded">R</kbd> - Retry interview (After completion)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}

function getQuestionTypeDescription(type: QuestionType): string {
  switch (type) {
    case 'Product Sense':
      return 'Design products, understand user needs, and make product decisions'
    case 'Estimation':
      return 'Market sizing, user estimation, and quantitative reasoning'
    case 'Execution':
      return 'Prioritization, roadmapping, and getting things done'
    case 'Strategy':
      return 'Business strategy, competitive analysis, and market positioning'
    default:
      return ''
  }
}