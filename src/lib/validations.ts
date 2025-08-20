import { z } from 'zod'

export const generateQuestionSchema = z.object({
  questionType: z.enum(['Product Sense', 'Estimation', 'Execution', 'Strategy']),
  difficulty: z.number().min(1).max(5).optional(),
})

export const evaluateAnswerSchema = z.object({
  question: z.string().min(1),
  transcript: z.string().min(1),
})

export const createAttemptSchema = z.object({
  mode: z.enum(['text', 'voice']),
  question: z.string(),
  topic: z.string().optional(),
  difficulty: z.number().optional(),
  transcript: z.string().optional(),
  feedbackJson: z.any().optional(),
  structure: z.number().min(0).max(5).optional(),
  clarity: z.number().min(0).max(5).optional(),
  productThinking: z.number().min(0).max(5).optional(),
  metrics: z.number().min(0).max(5).optional(),
  communication: z.number().min(0).max(5).optional(),
  overallScore: z.number().min(0).max(100).optional(),
  durationSec: z.number().optional(),
  audioUrl: z.string().optional(),
})

export type GenerateQuestionInput = z.infer<typeof generateQuestionSchema>
export type EvaluateAnswerInput = z.infer<typeof evaluateAnswerSchema>
export type CreateAttemptInput = z.infer<typeof createAttemptSchema>