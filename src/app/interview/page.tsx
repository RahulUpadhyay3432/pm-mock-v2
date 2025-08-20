'use client'

import { useState, useEffect, useCallback } from 'react'
import { RequireAuth } from '@/components/RequireAuth'
import { CountdownRing } from '@/components/CountdownRing'
import { TranscriptBox } from '@/components/TranscriptBox'
import { ScoreCard } from '@/components/ScoreCard'

type Mode = 'text' | 'voice'
type InterviewState = 'setup' | 'question' | 'answering' | 'complete'

interface QuestionData {
  question: string
  topic: string
  difficulty: number
  expected_axes: string[]
}

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

export default function Interview() {
  const [mode, setMode] = useState<Mode>('text')
  const [state, setState] = useState<InterviewState>('setup')
  const [questionData, setQuestionData] = useState<QuestionData | null>(null)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [scoreData, setScoreData] = useState<ScoreData | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(120)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  // Speech recognition setup
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [speechSupported, setSpeechSupported] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        setSpeechSupported(true)
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = true
        recognitionInstance.interimResults = true
        recognitionInstance.lang = 'en-US'

        recognitionInstance.onresult = (event) => {
          let interim = ''
          let final = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              final += transcript
            } else {
              interim += transcript
            }
          }

          setInterimTranscript(interim)
          if (final) {
            setTranscript(prev => prev + final)
          }
        }

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      }
    }
  }, [])

  const generateQuestion = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionType: 'Product Sense', // Default for now
          difficulty: 3,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setQuestionData(data)
        setState('question')
        
        // Read question aloud in voice mode
        if (mode === 'voice' && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(data.question)
          speechSynthesis.speak(utterance)
        }
      }
    } catch (error) {
      console.error('Failed to generate question:', error)
    } finally {
      setLoading(false)
    }
  }

  const startAnswering = () => {
    setState('answering')
    setStartTime(Date.now())
    setTranscript('')
    setInterimTranscript('')

    if (mode === 'voice' && recognition && speechSupported) {
      recognition.start()
      setIsListening(true)
    }
  }

  const stopAnswering = useCallback(async () => {
    if (recognition && isListening) {
      recognition.stop()
    }
    setIsListening(false)

    const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
    
    if (transcript.trim()) {
      await evaluateAnswer(duration)
    }
  }, [recognition, isListening, transcript, startTime])

  const evaluateAnswer = async (duration: number) => {
    if (!questionData || !transcript.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionData.question,
          transcript: transcript,
        }),
      })

      if (response.ok) {
        const evaluation = await response.json()
        setScoreData(evaluation)
        setState('complete')

        // Save attempt
        await fetch('/api/attempts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode,
            question: questionData.question,
            topic: questionData.topic,
            difficulty: questionData.difficulty,
            transcript,
            feedbackJson: evaluation,
            structure: evaluation.rubric.structure,
            clarity: evaluation.rubric.clarity,
            productThinking: evaluation.rubric.product_thinking,
            metrics: evaluation.rubric.metrics,
            communication: evaluation.rubric.communication,
            overallScore: evaluation.overall_score,
            durationSec: duration,
          }),
        })

        // Speak short feedback in voice mode
        if (mode === 'voice' && 'speechSynthesis' in window) {
          const feedback = `Your score is ${evaluation.overall_score}. ${evaluation.coaching.split('.')[0]}.`
          const utterance = new SpeechSynthesisUtterance(feedback)
          speechSynthesis.speak(utterance)
        }
      }
    } catch (error) {
      console.error('Failed to evaluate answer:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetInterview = () => {
    setState('setup')
    setQuestionData(null)
    setTranscript('')
    setInterimTranscript('')
    setScoreData(null)
    setIsListening(false)
    setStartTime(null)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && state === 'answering') {
        e.preventDefault()
        if (isListening) {
          stopAnswering()
        } else {
          startAnswering()
        }
      } else if (e.code === 'KeyR' && state === 'complete') {
        e.preventDefault()
        resetInterview()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [state, isListening, stopAnswering])

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mock Interview</h1>
            <div className="flex items-center gap-4">
              {/* Mode Switcher */}
              <div className="bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setMode('text')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    mode === 'text'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Text
                </button>
                <button
                  onClick={() => setMode('voice')}
                  disabled={!speechSupported}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    mode === 'voice'
                      ? 'bg-purple-600 text-white'
                      : speechSupported
                      ? 'text-gray-600 hover:text-gray-900'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Voice {!speechSupported && '(Unsupported)'}
                  {mode === 'voice' && <span className="ml-1 text-xs">Beta</span>}
                </button>
              </div>
              <button
                onClick={() => window.location.href = '/'}
                className="text-gray-600 hover:text-gray-900"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            {state === 'setup' && (
              <div className="text-center">
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Ready to Start?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    You'll receive a product management question and have {timerSeconds / 60} minutes to respond.
                    {mode === 'voice' && ' The question will be read aloud, and your response will be transcribed.'}
                  </p>
                  <button
                    onClick={generateQuestion}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    {loading ? 'Generating Question...' : 'Generate Question'}
                  </button>
                </div>
              </div>
            )}

            {state === 'question' && questionData && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {questionData.topic}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        Difficulty: {questionData.difficulty}/5
                      </span>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {questionData.question}
                  </h2>
                  <div className="text-center">
                    <button
                      onClick={startAnswering}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Start Answering
                    </button>
                  </div>
                </div>
              </div>
            )}

            {state === 'answering' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {questionData?.question}
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    {mode === 'text' ? (
                      <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="font-medium text-gray-900 mb-3">Your Response</h3>
                        <textarea
                          value={transcript}
                          onChange={(e) => setTranscript(e.target.value)}
                          placeholder="Type your answer here..."
                          className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={stopAnswering}
                            disabled={!transcript.trim() || loading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
                          >
                            {loading ? 'Evaluating...' : 'Submit Answer'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <TranscriptBox
                        finalTranscript={transcript}
                        interimTranscript={interimTranscript}
                        isListening={isListening}
                      />
                    )}
                  </div>

                  <div className="flex flex-col items-center space-y-4">
                    <CountdownRing
                      totalSeconds={timerSeconds}
                      isActive={isListening || state === 'answering'}
                      onComplete={stopAnswering}
                    />
                    
                    {mode === 'voice' && (
                      <div className="text-center space-y-2">
                        <button
                          onClick={isListening ? stopAnswering : startAnswering}
                          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                            isListening
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          {isListening ? 'Stop Recording' : 'Start Recording'}
                        </button>
                        <p className="text-xs text-gray-500">
                          Press Space to toggle recording
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {state === 'complete' && scoreData && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Interview Complete!
                  </h2>
                  <p className="text-gray-600">Here's your detailed feedback</p>
                </div>

                <ScoreCard scoreData={scoreData} />

                <div className="text-center space-x-4">
                  <button
                    onClick={resetInterview}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Try Another Question
                  </button>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
                <p className="text-center text-xs text-gray-500">
                  Press R to retry
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}