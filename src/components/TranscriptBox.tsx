'use client'

import { cn } from '@/lib/utils'

interface TranscriptBoxProps {
  interimTranscript?: string
  finalTranscript: string
  isListening: boolean
  className?: string
}

export function TranscriptBox({ 
  interimTranscript = '', 
  finalTranscript, 
  isListening, 
  className 
}: TranscriptBoxProps) {
  return (
    <div className={cn(
      "border rounded-lg p-4 min-h-[200px] bg-white shadow-sm",
      isListening && "ring-2 ring-blue-500 ring-opacity-50",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">Your Response</h3>
        <div className="flex items-center gap-2">
          {isListening && (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm text-red-600">Listening...</span>
            </>
          )}
        </div>
      </div>
      
      <div className="prose prose-sm max-w-none">
        {finalTranscript && (
          <p className="text-gray-900 whitespace-pre-wrap">
            {finalTranscript}
          </p>
        )}
        {interimTranscript && (
          <p className="text-gray-500 italic whitespace-pre-wrap">
            {interimTranscript}
          </p>
        )}
        {!finalTranscript && !interimTranscript && (
          <p className="text-gray-400 italic">
            {isListening 
              ? "Start speaking to see your transcript here..." 
              : "Your response will appear here..."
            }
          </p>
        )}
      </div>
    </div>
  )
}