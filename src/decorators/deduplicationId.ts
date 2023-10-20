import { TopicService } from '../sugar/guts/TopicService';

export const KEY: string = 'deduplication'

/**
 * An attribute marked as ignored will not be persisted.
 */
export function deduplicationId(originalMethod: any, context: ClassFieldDecoratorContext): void {
  context.addInitializer(function (): void {
    const { name } = context;
    const metadata = this.constructor[TopicService.PREFIX];
    if (metadata) metadata[KEY] = name;
  })
};
