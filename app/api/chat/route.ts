import { NextRequest, NextResponse } from 'next/server'
import { Groq } from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  const { messages } = await request.json()

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'GROQ_API_KEY is not set' }, { status: 500 })
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.2-90b-text-preview",
    })

    const reply = completion.choices[0]?.message?.content

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Error calling Groq API:', error)
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 })
  }
}
