import { TopicService } from '../sugar/guts/TopicService'

/**
 * Used to mark a class to store its instances in a specific topic.
 * 
 * This decorator can be combined with @mu-ts/serialization to impact how the object is
 * handled before being published.
 * 
 * @param arn of the topic that this object will be used with.
 * @returns 
 */
export function topic(arn: string): any {
  return function bucketDecorator(target: any, context: ClassDecoratorContext): typeof Function | void {
    context.addInitializer(function (this: any) {
      this[TopicService.PREFIX] = this[TopicService.PREFIX] ? this[TopicService.PREFIX].topic = arn : { topic: arn }
      /**
       * Creating an instance of the underlying class ensures that the field
       * and attribute level decorators will get picked up.
       */
      new this()
    })
  };
}
  