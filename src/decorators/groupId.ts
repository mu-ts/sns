import { TopicService } from '../sugar/guts/TopicService';

export const KEY: string = 'group'

/**
 * An attribute marked as ignored will not be persisted.
 */
export function groupId(originalMethod: any, context: ClassFieldDecoratorContext): void {
  context.addInitializer(function (): void {
    const { name } = context;
    const metadata = this.constructor[TopicService.PREFIX];
    if (metadata) metadata[KEY] = name;
  })
};
