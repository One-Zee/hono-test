import type { MessageZodType } from '@/modules/chat/validations/messages.schema'
import type { InstructionZodType } from '@/modules/instructions/validations/instruction.schema'
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import type { ChatCompletionSystemMessageParam } from 'openai/src/resources/index.js'
import env from '@/env'
import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
})

export async function completion(msg: ChatCompletionMessageParam, msgs: ChatCompletionMessageParam[], instructions?: InstructionZodType): Promise<MessageZodType | null> {
  try {
    const systemcontent: ChatCompletionSystemMessageParam = {
      role: 'system',
      content: 'You are a helpful assistant.',
    }

    if (instructions) {
      if (instructions.howToAnswer) {
        systemcontent.content = `${systemcontent.content} Instructions for response style: ${instructions.howToAnswer}.`
      }
      if (instructions.betterAnswers) {
        systemcontent.content = `${systemcontent.content} Preferred responses: ${instructions.betterAnswers}.`
      }
    }

    const responses = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      // model: 'gpt-4',
      messages: [
        systemcontent,
        ...msgs,
        msg,
      ],
    })

    const aiResponse = responses.choices[0].message

    return {
      content: aiResponse.content ?? '',
      role: aiResponse.role ?? '',
    }
  }
  catch (error) {
    console.error('An error occurred while fetching AI response:', error)
    return null
  }
}
