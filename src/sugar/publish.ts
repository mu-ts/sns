import { PublishCommand, PublishInput, PublishCommandOutput, MessageAttributeValue } from '@aws-sdk/client-sns'
import { toString, toMetadata } from '@mu-ts/serialization'

import { MessageReceipt } from '../model/MessageReceipt'
import { Client } from './guts/Client'
import { TopicService } from './guts/TopicService'

export async function publish(instance: any, _topic: string): Promise<MessageReceipt> {
  const topic: string = TopicService.getTopic(instance || _topic)

  const message: string = toString(instance)
  const metadata: Record<string, string | string[]> = toMetadata(instance)
  const groupId: string = TopicService.getGroupId(instance)
  const deduplicationId: string = TopicService.getDeduplicationId(instance)
  const subject: string = TopicService.getSubject(instance)
  const messageAttributes: Record<string, MessageAttributeValue> | undefined = Object.keys(metadata).reduce((attributes: Record<string, MessageAttributeValue>, key: string) => {
    if (Array.isArray(metadata[key])) {
      attributes[key] = {
        DataType: 'String.Array',
        StringValue: (metadata[key] as unknown as string[]).join(',')
      }
    } else {
      attributes[key] = {
        DataType: 'String',
        StringValue: metadata[key] as string
      }
    }
    return attributes
  }, {})

  const input: PublishInput = {
    TopicArn: topic,
    Message: message, 
    Subject: subject,
    MessageAttributes: messageAttributes,
    MessageDeduplicationId: deduplicationId,
    MessageGroupId: groupId,
  }
  const command = new PublishCommand(input)
  const response: PublishCommandOutput = await Client.instance().send(command)

  return new MessageReceipt(response.MessageId as string)
}
