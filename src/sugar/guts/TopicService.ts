import { KEY as DEDPULICATIONID_KEY } from '../../decorators/deduplicationId'
import { KEY as GROUPID_KEY } from '../../decorators/groupId'
import { KEY as SUBJECT_KEY } from '../../decorators/subject'

export class TopicService {
  public static readonly PREFIX: string = 'mu-ts/sns'
  
  public static getTopic(topicOrInstance: string | any) {
    if (typeof topicOrInstance === 'string') return topicOrInstance;
    return topicOrInstance[this.PREFIX]?.topic || topicOrInstance.constructor?.[this.PREFIX]?.topic
  }

  public static getGroupId(instance: any): string {
    const key: string | undefined =  instance.constructor?.[this.PREFIX]?.[GROUPID_KEY];
    if (key) return instance[key]
    return undefined;
  }
  
  public static getDeduplicationId(instance: any): string {
    const key: string | undefined = instance.constructor?.[this.PREFIX]?.[DEDPULICATIONID_KEY];
    if (key) return instance[key]
    return undefined;
  }

  public static getSubject(instance: any): string {
    const key: string | undefined = instance.constructor?.[this.PREFIX]?.[SUBJECT_KEY];
    if (key) return instance[key]
    return undefined;
  }
}