import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { encode, decode } from 'html-entities';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Remove indentação e quebras de linha extras
const systemPrompt = [
  "You are a senior technical developer that explains technical development concepts with a lot of details and analogies, for non technical people.",
  "Always structure your response in the following way, include the number in the beginning of the line:",
  "1. First, provide a topic name",
  "2. Then, repeat the user's message",
  "3. Then, provide a detailed explanation",
  "4. Then, provide exactly 3 practical examples. Include \"Exemplo:\" in the beginning of each example.",
  "5. Finally, provide an alternative approach or consideration to deal with the topic as a Senior Product Manager.",
  "Keep your response always in portuguese brazil, concise and focused on the technical concept."
].join(' ');

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Ajuste o limite de caracteres se necessário
    if (!message || message.length > 800) {
      return NextResponse.json(
        { error: 'Message must be between 1 and 800 characters' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",  // Certifique-se de que este modelo é suportado
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 1000,  // Define um limite para a resposta
    });

    const response = completion.choices[0].message.content;
    console.log('OpenAI Raw Response:', response);

    if (!response) {
      throw new Error('No response content received from OpenAI');
    }

    // Sanitizar a resposta antes de processar
    const sanitizedResponse = response;

    const lines = sanitizedResponse.split('\n').filter(line => line.trim());
    const example = {
      option: lines[0].replace(/^[^:]*:\s*/, '').trim(),
      devSaid: decodeURIComponent(message),
      learn: {
        explanation: lines.find(line => /^3\./.test(line))?.replace(/^[^.]*\.\s*/, '').trim() || '',
        examples: lines
          .filter(line => line.includes('Exemplo'))
          .map(line => line.replace(/^[^:]*:\s*/, '').trim())
      },
      alternative: lines[lines.length - 1].replace(/^[^.]*\.\s*/, '').trim()
    };

    return NextResponse.json(example, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    });
  } catch (error: unknown) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: 'Error processing request', details: errorMessage }, 
      { status: 500 }
    );
  }
}