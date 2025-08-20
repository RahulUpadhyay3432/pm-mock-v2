import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateQuestionSchema } from '@/lib/validations'
import { generateQuestion } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { questionType, difficulty } = generateQuestionSchema.parse(body)

    const questionData = await generateQuestion(questionType, difficulty)

    return NextResponse.json(questionData)
  } catch (error) {
    console.error('Generate question error:', error)
    return NextResponse.json(
      { error: 'Failed to generate question' },
      { status: 500 }
    )
  }
}