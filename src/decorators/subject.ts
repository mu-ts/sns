import { TopicService } from '../sugar/guts/TopicService';

export const KEY: string = 'subject'

/**
 * An attribute marked as ignored will not be persisted.
 */
export function subject(originalMethod: any, context: ClassFieldDecoratorContext): void {
  context.addInitializer(function (): void {
    const { name } = context;
    const metadata = this.constructor[TopicService.PREFIX];
    if (metadata) metadata[KEY] = name;
  })
};
