import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateQuestion(questionType: string, difficulty: number = 3) {
  const prompt = `Generate a ${questionType} product management interview question with difficulty level ${difficulty}/5.
  
  Return a JSON object with:
  - question: The interview question
  - topic: Brief topic/category (e.g., "Feature Design", "Market Sizing")
  - difficulty: Number 1-5
  - expected_axes: Array of key evaluation criteria for this question type
  
  For ${questionType} questions, focus on:
  ${getQuestionTypeGuidance(questionType)}
  
  Make it realistic and commonly asked in PM interviews.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    response_format: { type: 'json_object' }
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}

export async function evaluateAnswer(question: string, transcript: string) {
  const prompt = `Evaluate this PM interview answer using a structured rubric.

Question: ${question}

Answer: ${transcript}

Provide a JSON response with:
{
  "rubric": {
    "structure": 0-5 (logical flow, framework usage),
    "clarity": 0-5 (clear communication, conciseness),
    "product_thinking": 0-5 (user focus, business impact),
    "metrics": 0-5 (relevant KPIs, measurement approach),
    "communication": 0-5 (storytelling, persuasiveness)
  },
  "strengths": ["strength1", "strength2"],
  "gaps": ["gap1", "gap2"],
  "overall_score": 0-100,
  "coaching": "Brief actionable feedback for improvement"
}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    response_format: { type: 'json_object' }
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}

function getQuestionTypeGuidance(questionType: string): string {
  switch (questionType) {
    case 'Product Sense':
      return 'User empathy, problem identification, solution design, trade-offs'
    case 'Estimation':
      return 'Market sizing, logical breakdown, assumptions, sanity checks'
    case 'Execution':
      return 'Prioritization, roadmapping, stakeholder management, execution planning'
    case 'Strategy':
      return 'Market analysis, competitive positioning, business model, growth strategy'
    default:
      return 'General PM thinking and problem-solving'
  }
}

export { openai }