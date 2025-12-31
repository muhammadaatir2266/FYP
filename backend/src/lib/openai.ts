import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const SYSTEM_PROMPT = `You are an AI-powered medical assistant designed to help patients understand their symptoms and guide them to appropriate healthcare.

Your responsibilities:
1. Engage with patients in a conversational, empathetic manner
2. Ask clarifying questions about their symptoms
3. Extract key symptoms from the conversation
4. Provide general health information (NOT medical diagnosis)
5. Recommend appropriate specialist types based on symptoms
6. Remind patients that your advice is informational only

Guidelines:
- Be empathetic and professional
- Ask about symptom duration, severity, and any related symptoms
- Never provide definitive diagnoses
- Always recommend consulting a healthcare professional
- If symptoms sound serious (chest pain, difficulty breathing, severe pain), advise seeking immediate medical attention
- Extract symptoms in a structured format when possible

When you identify symptoms, format them as: [SYMPTOMS: symptom1, symptom2, symptom3]
When you recommend a specialist, format as: [SPECIALIST: specialty_name]
When symptoms are urgent, include: [URGENT: true]`

export async function getChatCompletion(
  messages: Array<{ role: 'user' | 'assistant' | 'system', content: string }>,
  userMessage: string
): Promise<string> {
  const fullMessages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    ...messages.map(m => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content: userMessage }
  ]

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: fullMessages,
    temperature: 0.7,
    max_tokens: 1000
  })

  return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.'
}

export function extractSymptoms(text: string): string[] {
  const symptomsMatch = text.match(/\[SYMPTOMS:\s*([^\]]+)\]/)
  if (symptomsMatch) {
    return symptomsMatch[1].split(',').map(s => s.trim().toLowerCase())
  }
  return []
}

export function extractSpecialist(text: string): string | null {
  const specialistMatch = text.match(/\[SPECIALIST:\s*([^\]]+)\]/)
  return specialistMatch ? specialistMatch[1].trim() : null
}

export function isUrgent(text: string): boolean {
  const urgentMatch = text.match(/\[URGENT:\s*true\]/i)
  return !!urgentMatch
}

export default openai

