import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { evaluateAnswerSchema } from '@/lib/validations'
import { evaluateAnswer } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { question, transcript } = evaluateAnswerSchema.parse(body)

    const evaluation = await evaluateAnswer(question, transcript)

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error('Evaluate answer error:', error)
    return NextResponse.json(
      { error: 'Failed to evaluate answer' },
      { status: 500 }
    )
  }
}