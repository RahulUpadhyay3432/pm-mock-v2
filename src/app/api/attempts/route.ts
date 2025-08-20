import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createAttemptSchema } from '@/lib/validations'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const attempts = await prisma.pMAttempt.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(attempts)
  } catch (error) {
    console.error('Get attempts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attempts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = createAttemptSchema.parse(body)

    const attempt = await prisma.pMAttempt.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    })

    return NextResponse.json(attempt)
  } catch (error) {
    console.error('Create attempt error:', error)
    return NextResponse.json(
      { error: 'Failed to create attempt' },
      { status: 500 }
    )
  }
}