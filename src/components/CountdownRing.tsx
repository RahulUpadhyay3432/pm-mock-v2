'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface CountdownRingProps {
  totalSeconds: number
  isActive: boolean
  onComplete?: () => void
  className?: string
}

export function CountdownRing({ 
  totalSeconds, 
  isActive, 
  onComplete, 
  className 
}: CountdownRingProps) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)

  useEffect(() => {
    setSecondsLeft(totalSeconds)
  }, [totalSeconds])

  useEffect(() => {
    if (!isActive || secondsLeft <= 0) return

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          onComplete?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, secondsLeft, onComplete])

  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  return (
    <div className={cn("relative w-32 h-32", className)}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 45}`}
          strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
          className={cn(
            "transition-all duration-1000 ease-linear",
            secondsLeft <= 30 ? "text-red-500" : 
            secondsLeft <= 60 ? "text-yellow-500" : "text-blue-500"
          )}
        />
      </svg>
      
      {/* Time display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={cn(
            "text-2xl font-bold",
            secondsLeft <= 30 ? "text-red-600" : 
            secondsLeft <= 60 ? "text-yellow-600" : "text-gray-700"
          )}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {isActive ? 'Recording' : 'Ready'}
          </div>
        </div>
      </div>
    </div>
  )
}