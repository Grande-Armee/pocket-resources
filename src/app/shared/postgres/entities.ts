import { Resource } from '../../domain/resource/entities/resource.entity';
import { Tag } from '../../domain/tag/entities/tag.entity';
import { UserResourceTag } from '../../domain/user-resource-tag/entities/user-resource-tag.entity';
import { UserResource } from '../../domain/user-resource/entities/user-resource.entity';

export const entities = [Resource, Tag, UserResource, UserResourceTag];
