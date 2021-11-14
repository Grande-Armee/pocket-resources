import { Resource } from '@domain/resource/entities/resource';
import { Tag } from '@domain/tag/entities/tag';
import { UserResource } from '@domain/userResource/entities/userResource';
import { UserResourceTag } from '@domain/userResourceTag/entities/userResourceTag';

export const entities = [Resource, Tag, UserResource, UserResourceTag];
